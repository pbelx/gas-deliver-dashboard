<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 mt-4">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Admin Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <div class="text-center mb-4">
              <v-icon size="48" color="primary">mdi-shield-account</v-icon>
              <p class="text-body-2 mt-2 text-medium-emphasis">
                Admin access only. Please enter your admin credentials.
              </p>
            </div>
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
                Login as Admin
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
  layout: 'empty',
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
  
  const success = await authStore.login({ 
    email: email.value, 
    password: password.value 
  });
  
  if (success) {
    router.push('/');
  }
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>