<template>
  <v-card class="mb-4">
    <v-card-title>
      Order #{{ order.id }}
    </v-card-title>
    <v-card-subtitle>
      Customer: {{ order.customerName }} - Date: {{ order.date }}
    </v-card-subtitle>
    <v-card-text>
      <p><strong>Total:</strong> {{ order.total }}</p>
      <p><strong>Status:</strong> <v-chip :color="statusColor" small>{{ order.status }}</v-chip></p>
      <!-- Add more order details here as needed -->
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="$emit('viewDetails', order.id)">View Details</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true,
    default: () => ({
      id: 'N/A',
      customerName: 'Unknown',
      date: 'N/A',
      total: '$0.00',
      status: 'Unknown'
    })
  }
})

defineEmits(['viewDetails'])

const statusColor = computed(() => {
  switch (props.order.status) {
    case 'Processing': return 'blue'
    case 'Shipped': return 'orange'
    case 'Delivered': return 'green'
    case 'Cancelled': return 'red'
    default: return 'grey'
  }
})
</script>

<style scoped>
/* Add any specific styling for the order card here */
</style>
