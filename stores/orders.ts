import { defineStore } from 'pinia';
import { useApiService } from '~/composables/useApiService';
import type { Order, OrderQueryParams, PaginatedResponse } from '~/services/api';
import { useAuthStore } from './auth'; // Import auth store to get token

interface OrdersState {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    pagination: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchOrders(params?: OrderQueryParams) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore(); // Get auth store instance

      if (!authStore.token) {
        this.error = 'Authentication token not found. Please login.';
        this.loading = false;
        // Optionally, you could try to force a logout or redirect here
        // authStore.logout();
        // useRouter().push('/login');
        return;
      }

      try {
        const response: PaginatedResponse<Order> = await apiService.getAllOrders(authStore.token, params);
        this.orders = response.data;
        this.pagination = response.pagination;
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch orders';
        this.orders = []; // Clear orders on error
        this.pagination = null; // Clear pagination on error
      } finally {
        this.loading = false;
      }
    },
    // Example action to change page, can be expanded with more query params
    async changeOrdersPage(page: number) {
        if (this.pagination) {
            await this.fetchOrders({ page, limit: this.pagination.limit });
        }
    }
  },
});
