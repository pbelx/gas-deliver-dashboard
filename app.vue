<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

// Initialize the auth store as soon as the app is created.
// This ensures that the auth state (especially from localStorage) is loaded
// before any navigation or rendering occurs.
const authStore = useAuthStore();
if (process.client) {
  authStore.initializeAuth();
}
</script>
