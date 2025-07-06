import { defineStore } from 'pinia';
import { useApiService } from '~/composables/useApiService';
import type { Order, OrderQueryParams, PaginatedResponse ,DriverUser, AssignDriverPayload, OrderStatus} from '~/services/api';
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
   availableDrivers: DriverUser[];
  loadingDrivers: boolean;
  driverError: string | null;
  assigningDriver: boolean;
  lastAssignedOrder: Order | null;
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    pagination: null,
    loading: false,
    error: null,
     availableDrivers: [],
    loadingDrivers: false,
    driverError: null,
    assigningDriver: false,
    lastAssignedOrder: null,
  }),
  getters: {
    hasOrders(state): boolean {
      return state.orders.length > 0;
    },
    isLoading(state): boolean {
      return state.loading;
    },
    hasError(state): boolean {
      return !!state.error;
    },
    getPagination(state): OrdersState['pagination'] {
      return state.pagination;
    },
    getAvailableDrivers(state): DriverUser[] {
      return state.availableDrivers;
    },
    // New getters for driver assignment
    unassignedOrders(state): Order[] {
      return state.orders.filter(order =>
        !order.driver && (order.status === 'pending' || order.status === 'confirmed')
      );
    },
    assignedOrders(state): Order[] {
      return state.orders.filter(order => order.driver);
    },
    ordersByStatus: (state) => (status: string): Order[] => {
      return state.orders.filter(order => order.status === status);
    },
    availableDriversCount(state): number {
      return state.availableDrivers.filter((driver: DriverUser) => driver.isActive).length;
    },
    driverById: (state) => (driverId: string): DriverUser | undefined => {
      return state.availableDrivers.find((driver: DriverUser) => driver.id === driverId);
    },
  },
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
    },

    async fetchAvailableDrivers() {
      this.loadingDrivers = true;
      this.driverError = null;
      const apiService = useApiService();
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.driverError = 'Authentication token not found. Please login.';
        this.loadingDrivers = false;
        return;
      }

      try {
        const response = await apiService.getAllDrivers(authStore.token, { isActive: true });
        this.availableDrivers = response.map(driver => ({
          ...driver,
          displayName: `${driver.firstName} ${driver.lastName}`,
        }));
      } catch (error: any) {
        this.driverError = error.message || 'Failed to load available drivers';
      } finally {
        this.loadingDrivers = false;
      }
    },

    async assignDriverToOrder(orderId: string, driverId: string, payload?: Omit<AssignDriverPayload, 'driverId'>) {
      this.assigningDriver = true;
      this.driverError = null;
      const apiService = useApiService();
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.driverError = 'Authentication token not found. Please login.';
        this.assigningDriver = false;
        throw new Error('Authentication token not found.');
      }

      try {
        const response = await apiService.assignDriverToOrder(orderId, driverId, authStore.token, payload);
        const updatedOrder = response.order;
        this.lastAssignedOrder = updatedOrder;

        // Update the order in the local state
        const index = this.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        return updatedOrder;
      } catch (error: any) {
        this.driverError = error.message || 'Failed to assign driver';
        throw error;
      } finally {
        this.assigningDriver = false;
      }
    },

    async updateOrderStatus(orderId: string, status: string) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.error = 'Authentication token not found. Please login.';
        this.loading = false;
        throw new Error('Authentication token not found.');
      }

      try {
        const updatedOrder = await apiService.updateOrder(orderId, { status: status as OrderStatus }, authStore.token);
        const index = this.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        return updatedOrder;
      } catch (error: any) {
        this.error = error.message || 'Failed to update order status';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteOrder(orderId: string) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.error = 'Authentication token not found. Please login.';
        this.loading = false;
        throw new Error('Authentication token not found.');
      }

      try {
        await apiService.deleteOrder(orderId, authStore.token);
        this.orders = this.orders.filter(order => order.id !== orderId);
      } catch (error: any) {
        this.error = error.message || 'Failed to delete order';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
});
