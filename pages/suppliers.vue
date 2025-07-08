<template>
  <v-container>
    <!-- Page Header -->
    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <h1 class="text-h4">Suppliers</h1>
            <p class="text-subtitle-1 text-grey">Manage your gas cylinder suppliers</p>
          </div>
          <v-btn
            color="#de2227"
            size="large"
            @click="openCreateDialog"
            prepend-icon="mdi-plus"
          >
            Add Supplier
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Error Alert -->
    <v-alert
      v-if="suppliersStore.error"
      type="error"
      dismissible
      class="mb-4"
      @click:close="suppliersStore.clearError"
    >
      {{ suppliersStore.error }}
    </v-alert>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="4">
        <v-card class="text-center">
          <v-card-text>
            <div class="text-h5 primary--text">{{ suppliersStore.suppliers.length }}</div>
            <div class="text-subtitle-1">Total Suppliers</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="text-center">
          <v-card-text>
            <div class="text-h5 success--text">{{ suppliersStore.activeSuppliers.length }}</div>
            <div class="text-subtitle-1">Active Suppliers</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="text-center">
          <v-card-text>
            <div class="text-h5 info--text">{{ suppliersStore.suppliers.length - suppliersStore.activeSuppliers.length }}</div>
            <div class="text-subtitle-1">Inactive Suppliers</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              label="Search suppliers..."
              prepend-inner-icon="mdi-magnify"
              clearable
              dense
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Status"
              clearable
              dense
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              color="#de2227"
              block
              @click="refreshData"
              :loading="suppliersStore.loading"
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
        :items="filteredSuppliers"
        :loading="suppliersStore.loading"
        item-key="id"
        class="elevation-1"
        :items-per-page="10"
      >
        <!-- Name Column -->
        <template v-slot:item.name="{ item }">
          <div>
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text-caption text-grey">{{ item.contactPerson }}</div>
          </div>
        </template>

        <!-- Contact Column -->
        <template v-slot:item.contact="{ item }">
          <div>
            <div>{{ item.phone }}</div>
            <div class="text-caption text-grey">{{ item.email || 'No email' }}</div>
          </div>
        </template>

        <!-- Address Column -->
        <template v-slot:item.address="{ item }">
          <div class="text-truncate" style="max-width: 200px;">
            {{ item.address }}
          </div>
        </template>

        <!-- Status Column -->
        <template v-slot:item.isActive="{ item }">
          <v-chip
            :color="item.isActive ? 'success' : 'error'"
            size="small"
            class="ma-1"
          >
            {{ item.isActive ? 'Active' : 'Inactive' }}
          </v-chip>
        </template>

        <!-- Cylinders Count Column -->
        <template v-slot:item.cylindersCount="{ item }">
          {{ item.gasCylinders?.length || 0 }}
        </template>

        <!-- Actions Column -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn
              icon="mdi-eye"
              size="small"
              variant="text"
              @click="viewSupplier(item)"
            ></v-btn>
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editSupplier(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="confirmDelete(item)"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="showDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditing ? 'Edit' : 'Add' }} Supplier</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="supplierForm" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.name"
                  label="Company Name*"
                  :rules="[rules.required]"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.contactPerson"
                  label="Contact Person*"
                  :rules="[rules.required]"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.phone"
                  label="Phone Number*"
                  :rules="[rules.required]"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  :rules="[rules.email]"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.address"
                  label="Address*"
                  :rules="[rules.required]"
                  outlined
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.latitude"
                  label="Latitude"
                  type="number"
                  step="any"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.longitude"
                  label="Longitude"
                  type="number"
                  step="any"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn
            color="#de2227"
            @click="saveSupplier"
            :loading="suppliersStore.loading"
            :disabled="!formValid"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ supplierToDelete?.name }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            @click="deleteSupplier"
            :loading="suppliersStore.loading"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="showViewDialog" max-width="500px">
      <v-card v-if="suppliersStore.selectedSupplier">
        <v-card-title>
          <span class="text-h5">{{ suppliersStore.selectedSupplier.name }}</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <strong>Contact Person:</strong> {{ suppliersStore.selectedSupplier.contactPerson }}
            </v-col>
            <v-col cols="6">
              <strong>Phone:</strong> {{ suppliersStore.selectedSupplier.phone }}
            </v-col>
            <v-col cols="12">
              <strong>Email:</strong> {{ suppliersStore.selectedSupplier.email || 'N/A' }}
            </v-col>
            <v-col cols="12">
              <strong>Address:</strong> {{ suppliersStore.selectedSupplier.address }}
            </v-col>
            <v-col cols="6" v-if="suppliersStore.selectedSupplier.latitude">
              <strong>Latitude:</strong> {{ suppliersStore.selectedSupplier.latitude }}
            </v-col>
            <v-col cols="6" v-if="suppliersStore.selectedSupplier.longitude">
              <strong>Longitude:</strong> {{ suppliersStore.selectedSupplier.longitude }}
            </v-col>
            <v-col cols="6">
              <strong>Status:</strong>
              <v-chip
                :color="suppliersStore.selectedSupplier.isActive ? 'success' : 'error'"
                size="small"
              >
                {{ suppliersStore.selectedSupplier.isActive ? 'Active' : 'Inactive' }}
              </v-chip>
            </v-col>
            <v-col cols="6">
              <strong>Gas Cylinders:</strong> {{ suppliersStore.selectedSupplier.gasCylinders?.length || 0 }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showViewDialog = false">Close</v-btn>
          <v-btn color="primary" @click="editSupplier(suppliersStore.selectedSupplier)">
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSuppliersStore } from '~/stores/suppliers';
import type { Supplier } from '~/stores/suppliers';

const suppliersStore = useSuppliersStore();

// Table headers
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Contact', key: 'contact', sortable: false },
  { title: 'Address', key: 'address', sortable: false },
  { title: 'Status', key: 'isActive', width: '120px' },
  { title: 'Cylinders', key: 'cylindersCount', width: '100px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px' },
];

// Filters
const searchQuery = ref('');
const statusFilter = ref('');

// Dialog states
const showDialog = ref(false);
const showDeleteDialog = ref(false);
const showViewDialog = ref(false);
const isEditing = ref(false);
const formValid = ref(false);

// Form data
const formData = ref({
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
});

const supplierToDelete = ref<Supplier | null>(null);

// Validation rules
const rules = {
  required: (value: any) => !!value || 'Required.',
  email: (value: string) => !value || /.+@.+\..+/.test(value) || 'Invalid email format.',
};

// Computed properties
const filteredSuppliers = computed(() => {
  let filtered = suppliersStore.suppliers;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(supplier =>
      supplier.name.toLowerCase().includes(query) ||
      supplier.contactPerson.toLowerCase().includes(query) ||
      supplier.phone.includes(query) ||
      supplier.email?.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value !== '') {
    const isActive = statusFilter.value === 'active';
    filtered = filtered.filter(supplier => supplier.isActive === isActive);
  }

  return filtered;
});

const statusOptions = [
  { value: 'active', title: 'Active' },
  { value: 'inactive', title: 'Inactive' },
];

// Methods
const openCreateDialog = () => {
  isEditing.value = false;
  formData.value = {
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    latitude: undefined,
    longitude: undefined,
  };
  showDialog.value = true;
};

const editSupplier = (supplier: Supplier) => {
  isEditing.value = true;
  formData.value = {
    name: supplier.name,
    contactPerson: supplier.contactPerson,
    phone: supplier.phone,
    email: supplier.email || '',
    address: supplier.address,
    latitude: supplier.latitude,
    longitude: supplier.longitude,
  };
  suppliersStore.selectedSupplier = supplier;
  showDialog.value = true;
  showViewDialog.value = false;
};

const viewSupplier = (supplier: Supplier) => {
  suppliersStore.selectedSupplier = supplier;
  showViewDialog.value = true;
};

const confirmDelete = (supplier: Supplier) => {
  supplierToDelete.value = supplier;
  showDeleteDialog.value = true;
};

const deleteSupplier = async () => {
  if (!supplierToDelete.value) return;
  
  // Note: You'll need to implement the delete method in the store
  // For now, this is a placeholder
  console.log('Delete supplier:', supplierToDelete.value);
  showDeleteDialog.value = false;
  supplierToDelete.value = null;
};

const saveSupplier = async () => {
  if (!formValid.value) return;

  try {
    if (isEditing.value && suppliersStore.selectedSupplier) {
      // Note: You'll need to implement the update method in the store
      console.log('Update supplier:', formData.value);
    } else {
      await suppliersStore.createSupplier(formData.value);
    }
    closeDialog();
  } catch (error) {
    console.error('Error saving supplier:', error);
  }
};

const closeDialog = () => {
  showDialog.value = false;
  suppliersStore.clearSelectedSupplier();
  formData.value = {
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    latitude: undefined,
    longitude: undefined,
  };
};

const refreshData = async () => {
  await suppliersStore.fetchSuppliers();
};

// Lifecycle
onMounted(async () => {
  await refreshData();
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
</style>