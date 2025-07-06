<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5">
        <v-icon left>mdi-update</v-icon>
        Update Order #{{ order?.orderNumber }} Status
      </v-card-title>
      
      <v-divider></v-divider>

      <v-card-text class="pt-4">
        <!-- Order Info -->
        <v-alert type="info" class="mb-4" variant="tonal">
          <div class="d-flex align-center">
            <div>
              <strong>Current Status:</strong> <v-chip :color="getStatusColor(order?.status)" size="small">{{ formatStatus(order?.status) }}</v-chip><br>
              <strong>Customer:</strong> {{ order?.customer?.firstName }} {{ order?.customer?.lastName }}<br>
              <strong>Delivery Address:</strong> {{ order?.deliveryAddress }}
            </div>
          </div>
        </v-alert>

        <!-- Status Selection -->
        <v-select
          v-model="selectedStatus"
          :items="statusOptions"
          item-title="title"
          item-value="value"
          label="Select New Status"
          :error-messages="statusError"
          required
          clearable
          hint="Choose the new status for this order"
          persistent-hint
        ></v-select>

        <!-- Notes -->
        <v-textarea
          v-model="statusNotes"
          label="Status Notes (Optional)"
          placeholder="Any relevant notes for this status update..."
          rows="3"
          class="mt-4"
        ></v-textarea>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        
        <v-btn 
          @click="closeDialog"
          :disabled="ordersStore.loading"
        >
          Cancel
        </v-btn>
        
        <v-btn 
          color="primary" 
          @click="updateStatus"
          :loading="ordersStore.loading"
          :disabled="!selectedStatus"
        >
          <v-icon left>mdi-check</v-icon>
          Update Status
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useOrdersStore } from '~/stores/orders';
import type { Order } from '~/services/api';
import { OrderStatus } from '~/services/api';

// Props
interface Props {
  modelValue: boolean;
  order: Order | null;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'status-updated': [oldStatus: OrderStatus, updatedOrder: Order];
}>();

// Composables
const ordersStore = useOrdersStore();

// Reactive data
const selectedStatus = ref<OrderStatus | null>(null);
const statusNotes = ref<string>('');
const statusError = ref<string[]>([]);

// Computed
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Status options for selection
const statusOptions = [
  { title: 'Confirmed', value: OrderStatus.CONFIRMED },
  { title: 'Assigned', value: OrderStatus.ASSIGNED },
  { title: 'In Transit', value: OrderStatus.IN_TRANSIT },
  { title: 'Delivered', value: OrderStatus.DELIVERED },
  { title: 'Cancelled', value: OrderStatus.CANCELLED },
];

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    resetForm();
    if (props.order) {
      selectedStatus.value = props.order.status;
    }
  }
});

// Methods
const updateStatus = async () => {
  if (!selectedStatus.value || !props.order) return;
  
  statusError.value = [];
  try {
    const oldStatus = props.order.status;
    const updatedOrder = await ordersStore.updateOrderStatus(props.order.id, selectedStatus.value);
    emit('status-updated', oldStatus, updatedOrder);
    closeDialog();
  } catch (error: any) {
    console.error('Error updating status:', error);
    statusError.value = [error.message || 'Failed to update status'];
  }
};

const closeDialog = () => {
  dialog.value = false;
};

const resetForm = () => {
  selectedStatus.value = null;
  statusNotes.value = '';
  statusError.value = [];
};

const getStatusColor = (status?: OrderStatus): string => {
  const colors = {
    [OrderStatus.PENDING]: 'orange',
    [OrderStatus.CONFIRMED]: 'blue',
    [OrderStatus.ASSIGNED]: 'purple',
    [OrderStatus.IN_TRANSIT]: 'cyan',
    [OrderStatus.DELIVERED]: 'green',
    [OrderStatus.CANCELLED]: 'red'
  };
  return status ? colors[status] || 'grey' : 'grey';
};

const formatStatus = (status?: OrderStatus): string => {
  if (!status) return 'N/A';
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};
</script>

<style scoped>
.v-card-title {
  background-color: rgb(var(--v-theme-surface-variant));
}
</style>