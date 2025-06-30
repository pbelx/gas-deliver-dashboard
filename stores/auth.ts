import { defineStore } from 'pinia';
import { useApiService } from '~/composables/useApiService';
import type { LoginCredentials, User, AuthResponse } from '~/services/api';

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
        // Try to load token from localStorage on client side initialization
        // This helps persist login across page refreshes
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          this.token = storedToken;
          // Potentially verify token with API here or fetch user data
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
      // Ensure getter reactivity by also checking token and user from state directly
      const hasToken = !!this.getToken; // Use getter to trigger localStorage check
      const hasUser = !!this.getUser;   // Use getter to trigger localStorage check
      this.isAuthenticated = hasToken && hasUser;
      return this.isAuthenticated;
    }
  },
  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      try {
        const response: AuthResponse = await apiService.login(credentials);
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        if (process.client) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('authUser', JSON.stringify(response.user));
        }
        return true; // Indicate success
      } catch (error: any) {
        this.error = error.message || 'Login failed';
        this.isAuthenticated = false;
        if (process.client) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
        return false; // Indicate failure
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.loading = true;
      // Potentially call an API logout endpoint if your backend supports/requires it
      // const apiService = useApiService();
      // if (this.token) {
      //   await apiService.logout(this.token);
      // }
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      if (process.client) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
      this.loading = false;
      // No need to return true/false usually for logout, but can if needed for UI logic
    },
    // Action to initialize store from localStorage (called in middleware or app.vue)
    initializeAuth() {
      if (process.client) {
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('authUser');
        if (token && userString) {
          try {
            this.token = token;
            this.user = JSON.parse(userString);
            this.isAuthenticated = true;
          } catch (e) {
            console.error("Error initializing auth from localStorage:", e);
            this.logout(); // Clear invalid stored data
          }
        }
      }
    }
  },
});
