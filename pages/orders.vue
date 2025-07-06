<!-- dash/pages/orders.vue -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Orders Management</h1>
      </v-col>
    </v-row>

    <v-alert v-if="ordersStore.error" type="error" dense class="mb-4">
      {{ ordersStore.error }}
    </v-alert>

    <!-- Success/Info Messages -->
    <v-alert 
      v-if="successMessage" 
      type="success" 
      dense 
      class="mb-4"
      dismissible
      @click:close="successMessage = ''"
    >
      {{ successMessage }}
    </v-alert>

    <v-card>
      <v-card-title>
        All Orders
        <v-spacer></v-spacer>
        
        <!-- Filters -->
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Filter by Status"
          clearable
          variant="outlined"
          density="compact"
          style="max-width: 200px;"
          class="mr-4"
          @update:model-value="applyFilters"
        ></v-select>
        
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
        <!-- Customer Column -->
        <template v-slot:item.customer="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" class="mr-3">
              <v-icon>mdi-account-circle</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">
                {{ item.customer?.firstName || 'N/A' }} {{ item.customer?.lastName || '' }}
              </div>
              <div class="text-caption text-grey">
                {{ item.customer?.phone || 'No phone' }}
              </div>
            </div>
          </div>
        </template>

        <!-- Total Amount Column -->
        <template v-slot:item.totalAmount="{ item }">
          <div class="font-weight-medium">
            UGX {{ formatAmount(item.totalAmount) }}
          </div>
        </template>

        <!-- Status Column -->
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small" class="font-weight-medium">
            {{ formatStatus(item.status) }}
          </v-chip>
        </template>

        <!-- Driver Column -->
        <template v-slot:item.driver="{ item }">
          <div v-if="item.driver" class="d-flex align-center">
            <v-avatar size="24" color="primary" class="mr-2">
              <v-icon size="16" color="white">mdi-account</v-icon>
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-medium">
                {{ item.driver.firstName }} {{ item.driver.lastName }}
              </div>
              <div class="text-caption text-grey">
                {{ item.driver.phone }}
              </div>
            </div>
          </div>
          <div v-else class="text-caption text-grey">
            No driver assigned
          </div>
        </template>

        <!-- Date Column -->
        <template v-slot:item.createdAt="{ item }">
          <div>
            <div class="text-body-2">{{ formatDate(item.createdAt) }}</div>
            <div class="text-caption text-grey">{{ formatTime(item.createdAt) }}</div>
          </div>
        </template>

        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-1">
            <!-- Assign Driver Button -->
            <v-btn 
              v-if="canAssignDriver(item)" 
              @click="openDriverAssignDialog(item)"
              size="small"
              color="primary"
              variant="outlined"
              :loading="ordersStore.assigningDriver"
            >
              <v-icon size="16" class="mr-1">mdi-account-plus</v-icon>
              Assign Driver
            </v-btn>

            <!-- Update Status Button -->
            <v-btn 
              v-if="canUpdateStatus(item)"
              @click="openStatusUpdateDialog(item)"
              size="small"
              color="secondary"
              variant="outlined"
            >
              <v-icon size="16" class="mr-1">mdi-update</v-icon>
              Update Status
            </v-btn>

            <!-- View Details Button -->
            <v-btn 
              @click="viewOrderDetails(item)"
              size="small"
              color="info"
              variant="text"
            >
              <v-icon size="16">mdi-eye</v-icon>
            </v-btn>

            <!-- More Actions Menu -->
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props"
                  size="small"
                  variant="text"
                  icon
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              
              <v-list density="compact">
                <v-list-item 
                  v-if="item.status === 'pending' || item.status === 'confirmed'"
                  @click="cancelOrder(item)"
                  :disabled="cancellingOrderId === item.id"
                >
                  <template v-slot:prepend>
                    <v-icon color="error">mdi-cancel</v-icon>
                  </template>
                  <v-list-item-title>Cancel Order</v-list-item-title>
                </v-list-item>
                
                <v-list-item 
                  v-if="item.status === 'cancelled'"
                  @click="deleteOrder(item)"
                  :disabled="deletingOrderId === item.id"
                >
                  <template v-slot:prepend>
                    <v-icon color="error">mdi-delete</v-icon>
                  </template>
                  <v-list-item-title>Delete Order</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>

        <!-- Loading Template -->
        <template v-slot:loading>
          <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
        </template>

        <!-- No Data Template -->
        <template v-slot:no-data>
          <div class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-1">mdi-package-variant</v-icon>
            <div class="text-h6 mt-4 mb-2">No orders found</div>
            <div class="text-body-2 text-grey">
              {{ ordersStore.loading ? 'Loading orders...' : 'There are no orders matching your current filters.' }}
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Driver Assignment Dialog -->
    <DriverAssignDialog
      v-model="showDriverAssignDialog"
      :order="selectedOrder"
      @driver-assigned="onDriverAssigned"
    />

    <!-- Status Update Dialog -->
    <OrderStatusDialog
      v-model="showStatusDialog"
      :order="selectedOrder"
      @status-updated="onStatusUpdated"
    />

    <!-- Order Details Dialog -->
    <v-dialog v-model="showOrderDetailsDialog" max-width="800px">
      <v-card v-if="selectedOrder">
        <v-card-title>
          Order #{{ selectedOrder.orderNumber }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
              <p><strong>Customer:</strong> {{ selectedOrder.customer.firstName }} {{ selectedOrder.customer.lastName }}</p>
              <p><strong>Delivery Address:</strong> {{ selectedOrder.deliveryAddress }}</p>
            </v-col>
            <v-col cols="12" md="6">
              <p><strong>Total Amount:</strong> UGX {{ selectedOrder.totalAmount }}</p>
              <p><strong>Driver:</strong> {{ selectedOrder.driver ? `${selectedOrder.driver.firstName} ${selectedOrder.driver.lastName}` : 'Not Assigned' }}</p>
              <p><strong>Order Date:</strong> {{ new Date(selectedOrder.createdAt).toLocaleString() }}</p>
            </v-col>
          </v-row>
          <v-divider class="my-4"></v-divider>
          <h3>Order Items</h3>
          <v-list>
            <v-list-item v-for="item in selectedOrder.items" :key="item.id">
              <v-list-item-title>{{ item.gasCylinder.name }}</v-list-item-title>
              <v-list-item-subtitle>
                Quantity: {{ item.quantity }} | Unit Price: UGX {{ item.unitPrice }} | Total: UGX {{ item.totalPrice }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showOrderDetailsDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useOrdersStore } from '~/stores/orders';
import { useRouter } from 'vue-router';
import type { Order } from '~/services/api';
import { OrderStatus } from '~/services/api';
import DriverAssignDialog from '~/components/DriverAssignDialog.vue';
import OrderStatusDialog from '../components/OrderStatusDialog.vue';

// Composables
const ordersStore = useOrdersStore();
const router = useRouter();

// Reactive data
const showDriverAssignDialog = ref(false);
const showStatusDialog = ref(false);
const showOrderDetailsDialog = ref(false);
const selectedOrder = ref<Order | null>(null);
const successMessage = ref('');
const statusFilter = ref<string | null>(null);

const cancellingOrderId = ref<string | null>(null);
const deletingOrderId = ref<string | null>(null);

// Table configuration
const headers = ref([
  { title: 'Order #', key: 'orderNumber', sortable: true, width: '120px' },
  { title: 'Customer', key: 'customer', sortable: false, width: '200px' },
  { title: 'Driver', key: 'driver', sortable: false, width: '180px' },
  { title: 'Date', key: 'createdAt', sortable: true, width: '150px' },
  { title: 'Total (UGX)', key: 'totalAmount', sortable: true, width: '120px' },
  { title: 'Status', key: 'status', sortable: true, width: '120px' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const, width: '300px' },
]);

const currentPage = ref(1);
const itemsPerPage = ref(10);

// Status options for filtering
const statusOptions = [
  { title: 'All Statuses', value: null },
  { title: 'Pending', value: 'pending' },
  { title: 'Confirmed', value: 'confirmed' },
  { title: 'Assigned', value: 'assigned' },
  { title: 'In Transit', value: 'in_transit' },
  { title: 'Delivered', value: 'delivered' },
  { title: 'Cancelled', value: 'cancelled' },
];

// Methods
const loadOrders = async () => {
  const params = {
    page: currentPage.value,
    limit: itemsPerPage.value,
    ...(statusFilter.value && { status: statusFilter.value })
  };
  await ordersStore.fetchOrders(params);
};

const updatePage = async (page: number) => {
  currentPage.value = page;
  await loadOrders();
};

const updateItemsPerPage = async (limit: number) => {
  itemsPerPage.value = limit;
  currentPage.value = 1;
  await loadOrders();
};

const applyFilters = async () => {
  currentPage.value = 1;
  await loadOrders();
};

// Driver Assignment
const canAssignDriver = (order: Order): boolean => {
  return (order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED) && !order.driver;
};

const openDriverAssignDialog = (order: Order) => {
  selectedOrder.value = order;
  showDriverAssignDialog.value = true;
};

const onDriverAssigned = async (updatedOrder: Order) => {
  successMessage.value = `Driver successfully assigned to Order #${updatedOrder.orderNumber}`;
  await loadOrders(); // Refresh the orders list
};

// Status Updates
const canUpdateStatus = (order: Order): boolean => {
  return order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED;
};

const openStatusUpdateDialog = (order: Order) => {
  selectedOrder.value = order;
  showStatusDialog.value = true;
};

const onStatusUpdated = async (updatedOrder: Order) => {
  successMessage.value = `Order #${updatedOrder.orderNumber} status updated to ${updatedOrder.status}`;
  await loadOrders();
};

// Order Actions
const cancelOrder = async (order: Order) => {
  if (!confirm(`Are you sure you want to cancel Order #${order.orderNumber}?`)) return;
  
  cancellingOrderId.value = order.id;
  try {
    await ordersStore.updateOrderStatus(order.id, OrderStatus.CANCELLED);
    successMessage.value = `Order #${order.orderNumber} has been cancelled`;
    await loadOrders();
  } catch (error: any) {
    console.error('Error cancelling order:', error);
    ordersStore.error = error.message || 'Failed to cancel order';
  } finally {
    cancellingOrderId.value = null;
  }
};

const deleteOrder = async (order: Order) => {
  if (!confirm(`Are you sure you want to permanently delete Order #${order.orderNumber}? This action cannot be undone.`)) return;
  
  deletingOrderId.value = order.id;
  try {
    await ordersStore.deleteOrder(order.id);
    successMessage.value = `Order #${order.orderNumber} has been deleted`;
    await loadOrders();
  } catch (error: any) {
    console.error('Error deleting order:', error);
    ordersStore.error = error.message || 'Failed to delete order';
  } finally {
    deletingOrderId.value = null;
  }
};

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order;
  showOrderDetailsDialog.value = true;
};

// Utility functions
const formatAmount = (amount: string | number): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-UG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-UG', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusColor = (status: string): string => {
  const colors = {
    pending: 'orange',
    confirmed: 'blue',
    assigned: 'purple',
    in_transit: 'cyan',
    delivered: 'green',
    cancelled: 'red'
  };
  return colors[status as keyof typeof colors] || 'grey';
};

const formatStatus = (status: string): string => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Lifecycle
onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
.gap-1 {
  gap: 4px;
}
</style>