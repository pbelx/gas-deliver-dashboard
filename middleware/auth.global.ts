import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  // Initialize auth store here to ensure it's loaded before checking isAuthenticated
  // This is crucial for when the app first loads or on direct navigation to a protected route.
  if (process.client) {
    const authStore = useAuthStore();
    // Ensure initializeAuth is called, especially if not called in app.vue
    // This helps in hydrating the store from localStorage before making decisions
    if (!authStore.getIsAuthenticated) { // Check if already initialized and authenticated
        authStore.initializeAuth();
    }

    // If the user is not authenticated and the target route is not the login page,
    // redirect to the login page.
    if (!authStore.getIsAuthenticated && to.path !== '/login') {
      console.log('User not authenticated, redirecting to login from', to.path);
      return navigateTo('/login');
    }

    // If the user is authenticated and tries to access the login page,
    // redirect them to the dashboard home.
    if (authStore.getIsAuthenticated && to.path === '/login') {
      console.log('User authenticated, redirecting from login to /');
      return navigateTo('/');
    }
  }
  // No action needed on the server-side for this specific logic,
  // as localStorage and full client-side auth state isn't available.
  // Server-side checks would typically involve verifying a cookie-based session if used.
});
