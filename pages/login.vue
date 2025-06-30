<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                label="Email"
                v-model="email"
                prepend-icon="mdi-account"
                type="email"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <v-text-field
                label="Password"
                v-model="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-alert v-if="authStore.error" type="error" dense class="mt-3 mb-3">
                {{ authStore.error }}
              </v-alert>
              <v-btn
                type="submit"
                color="primary"
                block
                :loading="authStore.loading"
                :disabled="authStore.loading"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'empty', // Use an empty layout for the login page if you have one
});

const email = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

const rules = {
  required: (value: string) => !!value || 'Required.',
  email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
};

const handleLogin = async () => {
  if (!email.value || !password.value) {
    authStore.$patch({ error: 'Email and password are required.'});
    return;
  }
  const success = await authStore.login({ email: email.value, password: password.value });
  if (success) {
    router.push('/'); // Redirect to dashboard home on successful login
  }
};

// Initialize auth state when component is created (client-side)
// This ensures that if the user is already logged in (token in localStorage),
// they might be redirected or state is updated accordingly by middleware later.
// However, middleware is a more robust place for the initial check.
// authStore.initializeAuth(); // Moved to middleware or app.vue for global effect
</script>

<style scoped>
/* You can add custom styles for the login page here */
.fill-height {
  min-height: 100vh;
}
</style>
