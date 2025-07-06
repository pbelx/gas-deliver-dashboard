import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const authStore = useAuthStore();
    
    // Initialize auth store from localStorage
    if (!authStore.getIsAuthenticated) {
      authStore.initializeAuth();
    }

    // If trying to access login page
    if (to.path === '/login') {
      // If user is already authenticated as admin, redirect to dashboard
      if (authStore.isAuthenticatedAdmin) {
        console.log('Admin already authenticated, redirecting from login to /');
        return navigateTo('/');
      }
      // Allow access to login page if not authenticated or not admin
      return;
    }

    // For all other routes, check if user is authenticated admin
    if (!authStore.isAuthenticatedAdmin) {
      console.log('User not authenticated as admin, redirecting to login from', to.path);
      return navigateTo('/login');
    }
  }
});