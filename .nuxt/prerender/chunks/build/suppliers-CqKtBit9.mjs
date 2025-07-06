import { defineStore } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/pinia/dist/pinia.prod.cjs';
import { d as useApiService, e as useAuthStore } from './server.mjs';

const useSuppliersStore = defineStore("suppliers", {
  state: () => ({
    suppliers: [],
    loading: false,
    error: null,
    selectedSupplier: null
  }),
  getters: {
    activeSuppliers: (state) => state.suppliers.filter((s) => s.isActive),
    supplierOptions: (state) => state.suppliers.filter((s) => s.isActive).map((s) => ({ value: s.id, text: s.name }))
  },
  actions: {
    async fetchSuppliers() {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      try {
        const suppliers = await apiService.getAllSuppliers(authStore.token || void 0);
        this.suppliers = suppliers;
      } catch (error) {
        this.error = error.message || "Failed to fetch suppliers";
        this.suppliers = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchSupplierById(id) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      try {
        const supplier = await apiService.getSupplierById(id, authStore.token || void 0);
        this.selectedSupplier = supplier;
        return supplier;
      } catch (error) {
        this.error = error.message || "Failed to fetch supplier";
        this.selectedSupplier = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createSupplier(supplierData) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.error = "Authentication token not found. Please login.";
        this.loading = false;
        throw new Error(this.error);
      }
      try {
        const newSupplier = await apiService.createSupplier(supplierData, authStore.token);
        this.suppliers.push(newSupplier);
        return newSupplier;
      } catch (error) {
        this.error = error.message || "Failed to create supplier";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateSupplier(id, supplierData) {
      var _a;
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.error = "Authentication token not found. Please login.";
        this.loading = false;
        throw new Error(this.error);
      }
      try {
        const updatedSupplier = await apiService.updateSupplier(id, supplierData, authStore.token);
        const index = this.suppliers.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.suppliers[index] = updatedSupplier;
        }
        if (((_a = this.selectedSupplier) == null ? void 0 : _a.id) === id) {
          this.selectedSupplier = updatedSupplier;
        }
        return updatedSupplier;
      } catch (error) {
        this.error = error.message || "Failed to update supplier";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteSupplier(id) {
      var _a;
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.error = "Authentication token not found. Please login.";
        this.loading = false;
        throw new Error(this.error);
      }
      try {
        await apiService.deleteSupplier(id, authStore.token);
        const index = this.suppliers.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.suppliers[index].isActive = false;
        }
        if (((_a = this.selectedSupplier) == null ? void 0 : _a.id) === id) {
          this.selectedSupplier = null;
        }
        return true;
      } catch (error) {
        this.error = error.message || "Failed to delete supplier";
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
    }
  }
});

export { useSuppliersStore as u };
//# sourceMappingURL=suppliers-CqKtBit9.mjs.map
