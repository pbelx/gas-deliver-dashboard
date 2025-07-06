<!-- dash/components/DriverAssignDialog.vue -->
<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5">
        <v-icon left>mdi-account-plus</v-icon>
        Assign Driver to Order #{{ order?.orderNumber }}
      </v-card-title>
      
      <v-divider></v-divider>

      <v-card-text class="pt-4">
        <!-- Order Info -->
        <v-alert type="info" class="mb-4" variant="tonal">
          <div class="d-flex align-center">
            <div>
              <strong>Customer:</strong> {{ order?.customer?.firstName }} {{ order?.customer?.lastName }}<br>
              <strong>Delivery Address:</strong> {{ order?.deliveryAddress }}<br>
              <strong>Total Amount:</strong> UGX {{ formatAmount(order?.totalAmount ?? 0) }}
            </div>
          </div>
        </v-alert>

        <!-- Driver Selection -->
        <v-select
          v-model="selectedDriverId"
          :items="ordersStore.availableDrivers"
          item-title="displayName"
          item-value="id"
          label="Select Available Driver"
          :loading="ordersStore.loadingDrivers"
          :error-messages="ordersStore.driverError"
          required
          clearable
          hint="Choose a driver to assign this order to"
          persistent-hint
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-avatar size="40" :color="getDriverStatusColor(item.raw)">
                  <v-icon color="white">mdi-account</v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title>
                {{ item.raw.firstName }} {{ item.raw.lastName }}
              </v-list-item-title>
              
              <v-list-item-subtitle>
                <div>
                  <v-icon size="small" class="mr-1">mdi-phone</v-icon>
                  {{ item.raw.phone }}
                </div>
                <div class="mt-1">
                  <v-chip 
                    :color="getDriverStatusColor(item.raw)" 
                    size="x-small"
                    class="mr-2"
                  >
                    {{ item.raw.isActive ? 'Active' : 'Inactive' }}
                  </v-chip>
                  <span class="text-caption">
                    Active Orders: {{ item.raw.stats?.activeOrdersCount || 0 }}
                  </span>
                </div>
              </v-list-item-subtitle>
            </v-list-item>
          </template>

          <template v-slot:no-data>
            <div class="text-center pa-4">
              <v-icon size="48" color="grey">mdi-account-off</v-icon>
              <div class="text-body-2 mt-2">No available drivers found</div>
            </div>
          </template>
        </v-select>

        <!-- Estimated Delivery Time -->
        <v-text-field
          v-model="estimatedDeliveryTime"
          label="Estimated Delivery Time (Optional)"
          type="datetime-local"
          hint="Set an estimated delivery time for the customer"
          persistent-hint
          class="mt-4"
        ></v-text-field>

        <!-- Assignment Notes -->
        <v-textarea
          v-model="assignmentNotes"
          label="Assignment Notes (Optional)"
          placeholder="Any special instructions for the driver..."
          rows="3"
          class="mt-4"
        ></v-textarea>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        
        <v-btn 
          @click="closeDialog"
          :disabled="ordersStore.assigningDriver"
        >
          Cancel
        </v-btn>
        
        <v-btn 
          color="primary" 
          @click="assignDriver"
          :loading="ordersStore.assigningDriver"
          :disabled="!selectedDriverId || ordersStore.loadingDrivers"
        >
          <v-icon left>mdi-check</v-icon>
          Assign Driver
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useOrdersStore } from '~/stores/orders';
import type { Order, User } from '~/services/api';

// Props
interface Props {
  modelValue: boolean;
  order: Order | null;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'driver-assigned': [order: Order];
}>();

// Composables
const ordersStore = useOrdersStore();

// Reactive data
const selectedDriverId = ref<string | null>(null);
const estimatedDeliveryTime = ref<string>('');
const assignmentNotes = ref<string>('');

// Computed
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    ordersStore.fetchAvailableDrivers();
    resetForm();
  }
});

// Methods
const assignDriver = async () => {
  if (!selectedDriverId.value || !props.order) return;
  
  try {
    const updatedOrder = await ordersStore.assignDriverToOrder(
      props.order.id, 
      selectedDriverId.value, 
      {
        estimatedDeliveryTime: estimatedDeliveryTime.value || undefined,
        specialInstructions: assignmentNotes.value || undefined
      }
    );
    
    emit('driver-assigned', updatedOrder);
    closeDialog();
    
  } catch (error: any) {
    console.error('Error assigning driver:', error);
  }
};

const closeDialog = () => {
  dialog.value = false;
};

const resetForm = () => {
  selectedDriverId.value = null;
  estimatedDeliveryTime.value = '';
  assignmentNotes.value = '';
  // If you need to clear errors, do it via ordersStore if supported:
  // ordersStore.driverError = [];
};

const formatAmount = (amount: string | number): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-UG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

const getDriverStatusColor = (driver: User): string => {
  return driver.isActive ? 'success' : 'error';
};
</script>

<style scoped>
.v-card-title {
  background-color: rgb(var(--v-theme-surface-variant));
}
</style>