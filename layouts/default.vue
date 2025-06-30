<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-list nav dense>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-cart" title="Orders" to="/orders"></v-list-item>
        
        <!-- Gas Cylinders Section -->
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-gas-cylinder"
              title="Gas Cylinders"
            ></v-list-item>
          </template>
          
          <v-list-item
            prepend-icon="mdi-format-list-bulleted"
            title="Manage Cylinders"
            to="/gas-cylinders"
            class="ml-4"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-account-group"
            title="Suppliers"
            to="/suppliers"
            class="ml-4"
          ></v-list-item>
        </v-list-group>
        
        <!-- Users/Admin Section -->
        <!-- <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account-multiple"
              title="Users"
            ></v-list-item>
          </template>
          
          <v-list-item
            prepend-icon="mdi-account-circle"
            title="Customers"
            to="/customers"
            class="ml-4"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-truck"
            title="Drivers"
            to="/drivers"
            class="ml-4"
          ></v-list-item>
        </v-list-group> -->
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="primary" @click="handleLogout">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Admin Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="authStore.user" class="mr-5">Welcome, {{ authStore.user.firstName }}</span>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const drawer = ref(true); // Drawer is open by default
const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

// Ensure auth state is initialized when the layout is mounted on client side
// This is particularly important if the user directly lands on a page using this layout
// and the middleware hasn't run yet or its client-side execution needs this.
if (process.client) {
  authStore.initializeAuth();
}
</script>

<style>
/* Optional: Add some global styles or layout-specific styles here */
.v-list-group__items .v-list-item {
  padding-left: 32px !important;
}
</style>