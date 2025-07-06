// stores/suppliers.ts - Updated version
import { defineStore } from 'pinia';
import { useApiService } from '~/composables/useApiService';
import { useAuthStore } from './auth';
import type { Supplier, CreateSupplierData, UpdateSupplierData } from '~/services/api';

interface SuppliersState {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  selectedSupplier: Supplier | null;
}

export const useSuppliersStore = defineStore('suppliers', {
  state: (): SuppliersState => ({
    suppliers: [],
    loading: false,
    error: null,
    selectedSupplier: null,
  }),

  getters: {
    activeSuppliers: (state) => state.suppliers.filter(s => s.isActive),
    supplierOptions: (state) => state.suppliers
      .filter(s => s.isActive)
      .map(s => ({ value: s.id, text: s.name })),
  },

  actions: {
    async fetchSuppliers() {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();

      try {
        const suppliers = await apiService.getAllSuppliers(authStore.token || undefined);
        this.suppliers = suppliers;
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch suppliers';
        this.suppliers = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchSupplierById(id: string) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();

      try {
        const supplier = await apiService.getSupplierById(id, authStore.token || undefined);
        this.selectedSupplier = supplier;
        return supplier;
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch supplier';
        this.selectedSupplier = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createSupplier(supplierData: CreateSupplierData) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.error = 'Authentication token not found. Please login.';
        this.loading = false;
        throw new Error(this.error);
      }

      try {
        const newSupplier = await apiService.createSupplier(supplierData, authStore.token);
        this.suppliers.push(newSupplier);
        return newSupplier;
      } catch (error: any) {
        this.error = error.message || 'Failed to create supplier';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateSupplier(id: string, supplierData: UpdateSupplierData) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.error = 'Authentication token not found. Please login.';
        this.loading = false;
        throw new Error(this.error);
      }

      try {
        const updatedSupplier = await apiService.updateSupplier(id, supplierData, authStore.token);
        
        // Update in the suppliers array
        const index = this.suppliers.findIndex(s => s.id === id);
        if (index !== -1) {
          this.suppliers[index] = updatedSupplier;
        }
        
        // Update selected supplier if it's the one being updated
        if (this.selectedSupplier?.id === id) {
          this.selectedSupplier = updatedSupplier;
        }
        
        return updatedSupplier;
      } catch (error: any) {
        this.error = error.message || 'Failed to update supplier';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteSupplier(id: string) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.error = 'Authentication token not found. Please login.';
        this.loading = false;
        throw new Error(this.error);
      }

      try {
        await apiService.deleteSupplier(id, authStore.token);
        
        // Remove from suppliers array or mark as inactive
        const index = this.suppliers.findIndex(s => s.id === id);
        if (index !== -1) {
          this.suppliers[index].isActive = false;
        }
        
        // Clear selected supplier if it was the deleted one
        if (this.selectedSupplier?.id === id) {
          this.selectedSupplier = null;
        }
        
        return true;
      } catch (error: any) {
        this.error = error.message || 'Failed to delete supplier';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    clearSelectedSupplier() {
      this.selectedSupplier = null;
    },
  },
});

// Re-export types for convenience
export type { Supplier, CreateSupplierData, UpdateSupplierData };