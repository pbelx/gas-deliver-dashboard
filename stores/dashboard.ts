import { defineStore } from 'pinia';
import { useApiService } from '~/composables/useApiService';
import { useAuthStore } from './auth';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalGasCylinders: number;
  totalUsers: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    stats: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchStatistics(startDate?: string, endDate?: string) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.error = 'Authentication token not found. Please login.';
        this.loading = false;
        return;
      }

      try {
        const [orderStats, overallStats] = await Promise.all([
          apiService.getOrderStatistics(authStore.token, startDate, endDate),
          apiService.getOverallDashboardStats(authStore.token)
        ]);

        this.stats = {
          ...orderStats,
          totalGasCylinders: overallStats.totalGasCylinders,
          totalUsers: overallStats.totalUsers,
        };
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch dashboard statistics';
        this.stats = null;
      } finally {
        this.loading = false;
      }
    },
  },
});
