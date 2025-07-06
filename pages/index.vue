<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Dashboard</h1>
        <p>Welcome to the Admin Dashboard. Here's a quick overview of your store's performance.</p>
      </v-col>
    </v-row>

    <!-- <v-alert v-if="dashboardStore.error" type="error" dense class="mb-4">
      {{ dashboardStore.error }}
    </v-alert> -->

    <v-row v-if="dashboardStore.loading">
      <v-col v-for="n in 3" :key="n" md="4">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-if="!dashboardStore.loading && dashboardStore.stats">
      <v-col md="4" sm="6" cols="12">
        <v-card class="mx-auto" elevation="2">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Total Orders</div>
              <div class="text-h6 mb-1">{{ dashboardStore.stats.totalOrders }}</div>
              <div class="text-caption">All orders placed.</div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col md="4" sm="6" cols="12">
        <v-card class="mx-auto" elevation="2">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Total Gas Cylinders</div>
              <div class="text-h6 mb-1">{{ dashboardStore.stats.totalGasCylinders }}</div>
              <div class="text-caption">Total number of gas cylinders available.</div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col md="4" sm="6" cols="12">
        <v-card class="mx-auto" elevation="2">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Total Users</div>
              <div class="text-h6 mb-1">{{ dashboardStore.stats.totalUsers }}</div>
              <div class="text-caption">Total registered users.</div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col md="4" sm="6" cols="12">
        <v-card class="mx-auto" elevation="2">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Total Revenue</div>
              <div class="text-h6 mb-1">${{ dashboardStore.stats.totalRevenue.toFixed(2) }}</div>
              <div class="text-caption">Sum of all completed order values.</div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col md="4" sm="6" cols="12">
        <v-card class="mx-auto" elevation="2">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Average Order Value</div>
              <div class="text-h6 mb-1">${{ dashboardStore.stats.averageOrderValue.toFixed(2) }}</div>
              <div class="text-caption">Average value of completed orders.</div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col md="4" sm="6" cols="12">
        <v-card class="mx-auto" elevation="2">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Pending Orders</div>
              <div class="text-h6 mb-1">{{ dashboardStore.stats.pendingOrders }}</div>
              <div class="text-caption">Orders awaiting processing or confirmation.</div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col md="4" sm="6" cols="12">
        <v-card class="mx-auto" elevation="2">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Completed Orders</div>
              <div class="text-h6 mb-1">{{ dashboardStore.stats.completedOrders }}</div>
              <div class="text-caption">Successfully delivered orders.</div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col md="4" sm="6" cols="12">
        <v-card class="mx-auto" elevation="2">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Cancelled Orders</div>
              <div class="text-h6 mb-1">{{ dashboardStore.stats.cancelledOrders }}</div>
              <div class="text-caption">Orders that have been cancelled.</div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="!dashboardStore.loading && !dashboardStore.stats && !dashboardStore.error">
        <v-col>
            <v-alert type="info">No statistics available at the moment.</v-alert>
        </v-col>
    </v-row>

    <!-- Placeholder for recent activity or other dashboard elements -->
    <v-row>
      <v-col>
        <v-card class="mt-5" elevation="1">
          <v-card-title>Recent Activity</v-card-title>
          <v-card-text>
            <p class="text-grey">This section can be populated with recent orders or user activities in a future update.</p>
            <!-- <v-list dense>
              <v-list-item>
                <v-list-item-title>Order #XXXXX placed</v-list-item-title>
              </v-list-item>
            </v-list> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDashboardStore } from '~/stores/dashboard';

const dashboardStore = useDashboardStore();

onMounted(async () => {
  // Fetch statistics if they haven't been loaded yet
  if (!dashboardStore.stats) {
    await dashboardStore.fetchStatistics();
  }
});
</script>

<style scoped>
h1 {
  margin-bottom: 16px;
}
p {
  margin-bottom: 8px;
}
.v-card {
  transition: box-shadow 0.3s ease-in-out;
}
.v-card:hover {
  box-shadow: 0px 5px 15px rgba(0,0,0,0.1) !important;
}
.text-overline {
    color: '#000'; /* Softer color for overline */
}
</style>
