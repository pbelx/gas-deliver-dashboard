<template>
  <v-container>
    <!-- Page Header -->
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <h1 class="text-h4">Gas Cylinders</h1>
            <p class="text-subtitle-1 text-grey">Manage your gas cylinder inventory</p>
          </div>
          <v-btn
            color="#de2227"
            size="large"
            @click="openCreateDialog"
            prepend-icon="mdi-plus"
          >
            Add Cylinder
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Error Alert -->
    <v-alert
      v-if="cylindersStore.error"
      type="error"
      dismissible
      class="mb-4"
      @click:close="cylindersStore.clearError"
    >
      {{ cylindersStore.error }}
    </v-alert>

    <!-- Debug Section (temporary) -->
    <v-card class="mb-4" color="grey-lighten-5">
      <v-card-title>🐛 Debug Info</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <strong>Cylinders Store State:</strong>
            <ul>
              <li>Loading: {{ cylindersStore.loading }}</li>
              <li>Error: {{ cylindersStore.error || 'None' }}</li>
              <li>Cylinders Count: {{ cylindersStore.cylinders.length }}</li>
              <li>Filtered Count: {{ filteredCylinders.length }}</li>
            </ul>
          </v-col>
          <v-col cols="12" md="6">
            <strong>Sample Data:</strong>
            <pre v-if="cylindersStore.cylinders.length > 0" style="font-size: 12px; max-height: 100px; overflow: auto;">{{ JSON.stringify(cylindersStore.cylinders[0], null, 2) }}</pre>
            <span v-else>No cylinders loaded</span>
          </v-col>
        </v-row>
        <v-btn @click="manualRefresh" color="warning">Manual Debug Refresh</v-btn>
      </v-card-text>
    </v-card>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center">
          <v-card-text>
            <div class="text-h5 primary--text">{{ cylindersStore.cylinders.length }}</div>
            <div class="text-subtitle-1">Total Cylinders</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center">
          <v-card-text>
            <div class="text-h5 success--text">{{ cylindersStore.availableCylinders.length }}</div>
            <div class="text-subtitle-1">Available</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center">
          <v-card-text>
            <div class="text-h5 warning--text">{{ cylindersStore.lowStockCylinders.length }}</div>
            <div class="text-subtitle-1">Low Stock</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center">
          <v-card-text>
            <div class="text-h5 info--text">{{ Object.keys(cylindersStore.cylindersByBrand).length }}</div>
            <div class="text-subtitle-1">Brands</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Search cylinders..."
              prepend-inner-icon="mdi-magnify"
              clearable
              dense
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedBrand"
              :items="brandOptions"
              label="Filter by Brand"
              clearable
              dense
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="availabilityFilter"
              :items="availabilityOptions"
              label="Availability"
              clearable
              dense
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              color="#de2227"
              block
              @click="refreshData"
              :loading="cylindersStore.loading"
            >
              Refresh
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredCylinders"
        :loading="cylindersStore.loading"
        item-value="id"
        class="elevation-1"
        :items-per-page="10"
        :no-data-text="cylindersStore.loading ? 'Loading cylinders...' : 'No gas cylinders found'"
      >
        <!-- Image Column -->
        <template #item.imageUrl="{ item }">
          <v-avatar size="40" class="my-2">
            <v-img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.name"
            />
            <v-icon v-else>mdi-gas-cylinder</v-icon>
          </v-avatar>
        </template>

        <!-- Name Column -->
        <template #item.name="{ item }">
          <div>
            <div class="font-weight-medium">{{ item.name || 'Unknown' }}</div>
            <div class="text-caption text-grey">{{ item.brand || 'No brand' }}</div>
          </div>
        </template>

        <!-- Weight Column -->
        <template #item.weight="{ item }">
          <span>{{ item.weight || 0 }} kg</span>
        </template>

        <!-- Price Column -->
        <template #item.price="{ item }">
          <span>UGX {{ formatPrice(item.price) }}</span>
        </template>

        <!-- Stock Column -->
        <template #item.stockQuantity="{ item }">
          <v-chip
            :color="getStockColor(item.stockQuantity)"
            size="small"
            class="ma-1"
          >
            {{ item.stockQuantity || 0 }}
          </v-chip>
        </template>

        <!-- Availability Column -->
        <template #item.isAvailable="{ item }">
          <v-chip
            :color="item.isAvailable ? 'success' : 'error'"
            size="small"
            class="ma-1"
          >
            {{ item.isAvailable ? 'Available' : 'Unavailable' }}
          </v-chip>
        </template>

        <!-- Supplier Column -->
        <template #item.supplier="{ item }">
          <span>{{ item.supplier?.name || 'No supplier' }}</span>
        </template>

        <!-- Actions Column -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn
              icon="mdi-eye"
              size="small"
              variant="text"
              @click="viewCylinder(item)"
            />
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editCylinder(item)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="confirmDelete(item)"
            />
          </div>
        </template>

        <!-- Loading state -->
        <template #loading>
          <v-skeleton-loader type="table-tbody" />
        </template>

        <!-- No data state -->
        <template #no-data>
          <v-alert type="info" class="ma-4">
            {{ cylindersStore.loading ? 'Loading gas cylinders...' : 'No gas cylinders found. Click "Add Cylinder" to get started.' }}
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- Simple fallback table if v-data-table fails -->
    <v-card v-if="filteredCylinders.length > 0 && debugMode" class="mt-4">
      <v-card-title>Fallback Table View</v-card-title>
      <v-card-text>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Weight</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cylinder in filteredCylinders.slice(0, 5)" :key="cylinder.id">
                <td>{{ cylinder.name }}</td>
                <td>{{ cylinder.brand || 'N/A' }}</td>
                <td>{{ cylinder.weight }} kg</td>
                <td>UGX {{ formatPrice(cylinder.price) }}</td>
                <td>{{ cylinder.stockQuantity }}</td>
                <td>{{ cylinder.supplier?.name || 'N/A' }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>

    <!-- View Dialog -->
    <v-dialog v-model="showViewDialog" max-width="500px">
      <v-card v-if="cylindersStore.selectedCylinder">
        <v-card-title>
          <span class="text-h5">{{ cylindersStore.selectedCylinder.name }}</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" v-if="cylindersStore.selectedCylinder.imageUrl">
              <v-img
                :src="cylindersStore.selectedCylinder.imageUrl"
                :alt="cylindersStore.selectedCylinder.name"
                max-height="200"
                contain
              />
            </v-col>
            <v-col cols="6">
              <strong>Brand:</strong> {{ cylindersStore.selectedCylinder.brand || 'N/A' }}
            </v-col>
            <v-col cols="6">
              <strong>Weight:</strong> {{ cylindersStore.selectedCylinder.weight }} kg
            </v-col>
            <v-col cols="6">
              <strong>Price:</strong> UGX {{ formatPrice(cylindersStore.selectedCylinder.price) }}
            </v-col>
            <v-col cols="6">
              <strong>Stock:</strong> {{ cylindersStore.selectedCylinder.stockQuantity }}
            </v-col>
            <v-col cols="6">
              <strong>Supplier:</strong> {{ cylindersStore.selectedCylinder.supplier?.name || 'N/A' }}
            </v-col>
            <v-col cols="6">
              <strong>Status:</strong> 
              <v-chip
                :color="cylindersStore.selectedCylinder.isAvailable ? 'success' : 'error'"
                size="small"
              >
                {{ cylindersStore.selectedCylinder.isAvailable ? 'Available' : 'Unavailable' }}
              </v-chip>
            </v-col>
            <v-col cols="12" v-if="cylindersStore.selectedCylinder.description">
              <strong>Description:</strong>
              <p class="mt-2">{{ cylindersStore.selectedCylinder.description }}</p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showViewDialog = false">Close</v-btn>
          <v-btn color="primary" @click="editCylinder(cylindersStore.selectedCylinder)">
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useGasCylindersStore } from '~/stores/gasCylinders';
import { useSuppliersStore } from '~/stores/suppliers';
import { useAuthStore } from '~/stores/auth';
import type { GasCylinder } from '~/services/api';

const cylindersStore = useGasCylindersStore();
const suppliersStore = useSuppliersStore();
const authStore = useAuthStore();

// Debug mode
const debugMode = ref(false);

// Table headers
const headers = [
  { title: 'Image', key: 'imageUrl', sortable: false, width: '80px' },
  { title: 'Name', key: 'name' },
  { title: 'Weight', key: 'weight', width: '100px' },
  { title: 'Price', key: 'price', width: '120px' },
  { title: 'Stock', key: 'stockQuantity', width: '100px' },
  { title: 'Available', key: 'isAvailable', width: '120px' },
  { title: 'Supplier', key: 'supplier' },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px' },
];

// Filters
const searchQuery = ref('');
const selectedBrand = ref('');
const availabilityFilter = ref('');

// Dialog states
const showViewDialog = ref(false);

// Computed properties
const filteredCylinders = computed(() => {
  let filtered = cylindersStore.cylinders || [];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(cylinder =>
      cylinder.name?.toLowerCase().includes(query) ||
      cylinder.brand?.toLowerCase().includes(query) ||
      cylinder.supplier?.name?.toLowerCase().includes(query)
    );
  }

  if (selectedBrand.value) {
    filtered = filtered.filter(cylinder => cylinder.brand === selectedBrand.value);
  }

  if (availabilityFilter.value !== '') {
    const isAvailable = availabilityFilter.value === 'available';
    filtered = filtered.filter(cylinder => cylinder.isAvailable === isAvailable);
  }

  return filtered;
});

const brandOptions = computed(() => {
  const brands = [...new Set(cylindersStore.cylinders.map(c => c.brand).filter(Boolean))];
  return brands.map(brand => ({ value: brand, title: brand }));
});

const availabilityOptions = [
  { value: 'available', title: 'Available' },
  { value: 'unavailable', title: 'Unavailable' },
];

// Methods
const formatPrice = (price: number): string => {
  return (price || 0).toLocaleString();
};

const getStockColor = (stock: number): string => {
  if (stock <= 5) return 'error';
  if (stock <= 10) return 'warning';
  return 'success';
};

const openCreateDialog = () => {
  // Implementation for opening create dialog
  console.log('Opening create dialog...');
};

const editCylinder = (cylinder: GasCylinder) => {
  cylindersStore.selectedCylinder = cylinder;
  console.log('Editing cylinder:', cylinder.name);
};

const viewCylinder = (cylinder: GasCylinder) => {
  cylindersStore.selectedCylinder = cylinder;
  showViewDialog.value = true;
};

const confirmDelete = (cylinder: GasCylinder) => {
  if (confirm(`Are you sure you want to delete "${cylinder.name}"?`)) {
    console.log('Deleting cylinder:', cylinder.name);
  }
};

const refreshData = async () => {
  try {
    await Promise.all([
      cylindersStore.fetchCylinders(),
      suppliersStore.fetchSuppliers()
    ]);
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
};

const manualRefresh = async () => {
  console.log('Manual refresh triggered');
  debugMode.value = true;
  await refreshData();
};

// Lifecycle
onMounted(async () => {
  console.log('Gas cylinders page mounted');
  console.log('Auth token:', authStore.token ? 'Present' : 'Missing');
  
  try {
    await refreshData();
    console.log('Data loaded, cylinders count:', cylindersStore.cylinders.length);
  } catch (error) {
    console.error('Error loading data on mount:', error);
  }
});

// Watch for changes in suppliers to ensure form options are available
watch(() => suppliersStore.suppliers.length, (newLength) => {
  if (newLength === 0 && !suppliersStore.loading) {
    suppliersStore.fetchSuppliers();
  }
});

// Watch for changes in cylinders data
watch(() => cylindersStore.cylinders.length, (newLength) => {
  console.log('Cylinders array length changed:', newLength);
});
</script>

<style scoped>
.text-h4 {
  margin-bottom: 8px;
}

.gap-1 {
  gap: 4px;
}

.v-card {
  transition: box-shadow 0.3s ease-in-out;
}

.v-card:hover {
  box-shadow: 0px 5px 15px rgba(0,0,0,0.1) !important;
}

pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 11px;
}
</style>