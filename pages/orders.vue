<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Orders</h1>
      </v-col>
    </v-row>

    <!-- Debug info (remove this in production) -->
    <!-- <v-card class="mb-4" v-if="showDebugInfo">
      <v-card-title>Debug Info</v-card-title>
      <v-card-text>
        <p><strong>Orders Count:</strong> {{ ordersStore.orders?.length || 0 }}</p>
        <p><strong>Loading:</strong> {{ ordersStore.loading }}</p>
        <p><strong>Error:</strong> {{ ordersStore.error || 'None' }}</p>
        <p><strong>Pagination:</strong> {{ JSON.stringify(ordersStore.pagination) }}</p>
        <p><strong>Current Page:</strong> {{ currentPage }}</p>
        <p><strong>Items Per Page:</strong> {{ itemsPerPage }}</p>
      </v-card-text>
    </v-card> -->

    <v-alert v-if="ordersStore.error" type="error" dense class="mb-4">
      {{ ordersStore.error }}
    </v-alert>

    <v-card>
      <v-card-title>
        All Orders
        <v-spacer></v-spacer>
        <!-- <v-btn 
          color="primary" 
          @click="toggleDebugInfo" 
          variant="outlined" 
          class="mr-2"
        >
          <v-icon left>mdi-bug</v-icon>
          Debug
        </v-btn> -->
        <v-btn color="primary" @click="loadOrders" :loading="ordersStore.loading">
          <v-icon left>mdi-refresh</v-icon>
          Refresh
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="ordersStore.orders || []"
        :loading="ordersStore.loading"
        item-value="id"
        class="elevation-1"
        :server-items-length="ordersStore.pagination?.total || 0"
        :page="currentPage"
        :items-per-page="itemsPerPage"
        @update:page="updatePage"
        @update:items-per-page="updateItemsPerPage"
      >
        <template v-slot:item.customer="{ item }">
          {{ item.customer?.firstName || 'N/A' }} {{ item.customer?.lastName || '' }}
        </template>
        <template v-slot:item.totalAmount="{ item }">
          {{ formatAmount(item.totalAmount) }}
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" small>{{ item.status }}</v-chip>
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="viewOrderDetails(item)">mdi-eye</v-icon>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
        </template>
        <template v-slot:no-data>
          <v-alert type="info" class="ma-4">
            {{ ordersStore.loading ? 'Loading orders...' : 'No orders found.' }}
          </v-alert>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useOrdersStore } from '~/stores/orders';
import type { Order } from '~/services/api';
import { OrderStatus } from '~/services/api';

const ordersStore = useOrdersStore();
const showDebugInfo = ref(false);

const headers = ref([
  { title: 'Order #', key: 'orderNumber', sortable: true },
  { title: 'Customer', key: 'customer', sortable: false },
  { title: 'Date', key: 'createdAt', sortable: true },
  { title: 'Total(UGX)', key: 'totalAmount', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]);

const currentPage = ref(1);
const itemsPerPage = ref(10);

// Helper functions
const formatAmount = (amount: string | number): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return String(numAmount || 0);
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
};

const toggleDebugInfo = () => {
  showDebugInfo.value = !showDebugInfo.value;
};

const loadOrders = async () => {
  try {
    console.log('Loading orders with params:', {
      page: currentPage.value,
      limit: itemsPerPage.value
    });
    
    await ordersStore.fetchOrders({ 
      page: currentPage.value, 
      limit: itemsPerPage.value 
    });
    
    console.log('Orders loaded:', ordersStore.orders);
    console.log('Pagination:', ordersStore.pagination);
  } catch (error) {
    console.error('Error loading orders:', error);
  }
};

onMounted(async () => {
  console.log('Component mounted');
  
  // Initialize pagination from store if available
  if (ordersStore.pagination) {
    currentPage.value = ordersStore.pagination.page || 1;
    itemsPerPage.value = ordersStore.pagination.limit || 10;
  }
  
  // Always fetch orders on mount for fresh data
  await loadOrders();
});

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING: return 'blue-grey';
    case OrderStatus.CONFIRMED: return 'blue';
    case OrderStatus.ASSIGNED: return 'cyan';
    case OrderStatus.IN_TRANSIT: return 'orange';
    case OrderStatus.DELIVERED: return 'green';
    case OrderStatus.CANCELLED: return 'red';
    default: return 'grey';
  }
};

const viewOrderDetails = (order: Order) => {
  console.log('View order details:', order);
  const customerName = `${order.customer?.firstName || 'N/A'} ${order.customer?.lastName || ''}`.trim();
  const amount = formatAmount(order.totalAmount);
  alert(`Viewing Order: #${order.orderNumber}\nCustomer: ${customerName}\nTotal: $${amount}`);
};

const updatePage = async (newPage: number) => {
  console.log('Updating page to:', newPage);
  currentPage.value = newPage;
  await loadOrders();
};

const updateItemsPerPage = async (newItemsPerPage: number) => {
  console.log('Updating items per page to:', newItemsPerPage);
  itemsPerPage.value = newItemsPerPage;
  currentPage.value = 1; // Reset to first page
  await loadOrders();
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>