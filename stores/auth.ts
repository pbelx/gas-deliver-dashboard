import { defineStore } from 'pinia';
import { useApiService } from '../composables/useApiService';
import type { LoginCredentials, User, AuthResponse } from '../services/api';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),
  getters: {
    getToken(): string | null {
      if (process.client && !this.token) {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          this.token = storedToken;
        }
      }
      return this.token;
    },
    getUser(): User | null {
       if (process.client && !this.user) {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          try {
            this.user = JSON.parse(storedUser);
          } catch (e) {
            console.error("Failed to parse stored user", e);
            localStorage.removeItem('authUser');
          }
        }
      }
      return this.user;
    },
    getIsAuthenticated(): boolean {
      const hasToken = !!this.getToken;
      const hasUser = !!this.getUser;
      this.isAuthenticated = hasToken && hasUser;
      return this.isAuthenticated;
    },
    // New getter to check if user is admin
    isAdmin(): boolean {
      return this.getUser?.role === 'admin';
    },
    // Combined getter for authenticated admin
    isAuthenticatedAdmin(): boolean {
      return this.getIsAuthenticated && this.isAdmin;
    }
  },
  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      try {
        const response: AuthResponse = await apiService.login(credentials);
        
        // Check if user is admin before allowing login
        if (response.user.role !== 'admin') {
          this.error = 'Access denied. Admin privileges required.';
          this.isAuthenticated = false;
          if (process.client) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
          }
          return false;
        }
        
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        if (process.client) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('authUser', JSON.stringify(response.user));
        }
        return true;
      } catch (error: any) {
        this.error = error.message || 'Login failed';
        this.isAuthenticated = false;
        if (process.client) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
        return false;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.loading = true;
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      if (process.client) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
      this.loading = false;
    },
    initializeAuth() {
      if (process.client) {
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('authUser');
        if (token && userString) {
          try {
            const user = JSON.parse(userString);
            // Check if stored user is admin
            if (user.role === 'admin') {
              this.token = token;
              this.user = user;
              this.isAuthenticated = true;
            } else {
              // Clear non-admin user data
              this.logout();
            }
          } catch (e) {
            console.error("Error initializing auth from localStorage:", e);
            this.logout();
          }
        }
      }
    }
  },
});