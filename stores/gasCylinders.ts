// stores/gasCylinders.ts - Updated version
import { defineStore } from 'pinia';
import { useApiService } from '~/composables/useApiService';
import { useAuthStore } from './auth';
import type { GasCylinder } from '~/services/api';

interface GasCylindersState {
  cylinders: GasCylinder[];
  loading: boolean;
  error: string | null;
  selectedCylinder: GasCylinder | null;
}

interface CreateCylinderData {
  name: string;
  weight: number;
  price: number;
  description?: string;
  brand?: string;
  supplierId: string;
  stockQuantity: number;
  imageUrl?: string;
}

interface UpdateCylinderData {
  name?: string;
  weight?: number;
  price?: number;
  description?: string;
  brand?: string;
  isAvailable?: boolean;
  stockQuantity?: number;
  imageUrl?: string;
}

export const useGasCylindersStore = defineStore('gasCylinders', {
  state: (): GasCylindersState => ({
    cylinders: [],
    loading: false,
    error: null,
    selectedCylinder: null,
  }),

  getters: {
    availableCylinders: (state) => state.cylinders.filter(c => c.isAvailable),
    cylindersByBrand: (state) => {
      const brands = state.cylinders.reduce((acc, cylinder) => {
        const brand = cylinder.brand || 'Unknown';
        if (!acc[brand]) acc[brand] = [];
        acc[brand].push(cylinder);
        return acc;
      }, {} as Record<string, GasCylinder[]>);
      return brands;
    },
    lowStockCylinders: (state) => state.cylinders.filter(c => c.stockQuantity <= 5),
  },

  actions: {
    async fetchCylinders() {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();

      try {
        const cylinders = await apiService.getAllGasCylinders(authStore.token || undefined);
        this.cylinders = cylinders;
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch gas cylinders';
        this.cylinders = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchCylinderById(id: string) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();

      try {
        const cylinder = await apiService.getGasCylinderById(id, authStore.token || undefined);
        this.selectedCylinder = cylinder;
        return cylinder;
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch gas cylinder';
        this.selectedCylinder = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createCylinder(cylinderData: CreateCylinderData) {
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
        // Convert the form data to match the API interface
        const apiData = {
          ...cylinderData,
          isAvailable: true, // Default for new cylinders
          supplier: { id: cylinderData.supplierId } // API expects supplier object
        };

        const newCylinder = await apiService.createGasCylinder(apiData as any, authStore.token);
        this.cylinders.push(newCylinder);
        return newCylinder;
      } catch (error: any) {
        this.error = error.message || 'Failed to create gas cylinder';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateCylinder(id: string, cylinderData: UpdateCylinderData) {
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
        const updatedCylinder = await apiService.updateGasCylinder(id, cylinderData, authStore.token);
        
        // Update in the cylinders array
        const index = this.cylinders.findIndex(c => c.id === id);
        if (index !== -1) {
          this.cylinders[index] = updatedCylinder;
        }
        
        // Update selected cylinder if it's the one being updated
        if (this.selectedCylinder?.id === id) {
          this.selectedCylinder = updatedCylinder;
        }
        
        return updatedCylinder;
      } catch (error: any) {
        this.error = error.message || 'Failed to update gas cylinder';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCylinder(id: string) {
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
        await apiService.deleteGasCylinder(id, authStore.token);
        
        // Remove from cylinders array
        const index = this.cylinders.findIndex(c => c.id === id);
        if (index !== -1) {
          this.cylinders.splice(index, 1);
        }
        
        // Clear selected cylinder if it was the deleted one
        if (this.selectedCylinder?.id === id) {
          this.selectedCylinder = null;
        }
        
        return true;
      } catch (error: any) {
        this.error = error.message || 'Failed to delete gas cylinder';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    clearSelectedCylinder() {
      this.selectedCylinder = null;
    },
  },
});

// Re-export types for convenience
export type { CreateCylinderData, UpdateCylinderData };