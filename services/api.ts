// services/api.ts - Complete implementation
const API_BASE_URL = 'https://gas.bxmedia.pro/api';
// const API_BASE_URL = 'http://192.168.100.26:3000/api';

// ==================== INTERFACES ====================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'driver' | 'admin';
  address?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: 'customer' | 'driver' | 'admin';
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Supplier interfaces
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  gasCylinders?: GasCylinder[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupplierData {
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateSupplierData {
  name?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
}

// Gas Cylinder interfaces
export interface GasCylinder {
  id: string;
  name: string;
  weight: number; // Weight in kg
  price: number;
  description?: string;
  brand?: string;
  stockQuantity: number;
  isAvailable: boolean;
  imageUrl?: string;
  supplier?: {
    id: string;
    name: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGasCylinderData {
  name: string;
  weight: number;
  price: number;
  description?: string;
  brand?: string;
  supplierId: string;
  stockQuantity: number;
  imageUrl?: string;
}

export interface UpdateGasCylinderData {
  name?: string;
  weight?: number;
  price?: number;
  description?: string;
  brand?: string;
  isAvailable?: boolean;
  stockQuantity?: number;
  imageUrl?: string;
  supplierId?: string;
}

// Order interfaces
export interface OrderItemPayload {
  cylinderId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customerId: string;
  items: OrderItemPayload[];
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  specialInstructions?: string;
}

export interface UpdateOrderPayload {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  driverId?: string;
  deliveryAddress?: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  gasCylinder: GasCylinder;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ASSIGNED = 'assigned',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: User;
  driver?: User;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderQueryParams {
  status?: string;
  customerId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

// Driver Assignment Interface
export interface AssignDriverPayload {
  driverId: string;
  estimatedDeliveryTime?: string;
  specialInstructions?: string;
}

// Driver Statistics Interface
export interface DriverStats {
  activeOrdersCount: number;
  completedOrdersCount: number;
  averageRating?: number;
  isOnline: boolean;
}

// Extended User interface for drivers
export interface DriverUser extends User {
  stats?: DriverStats;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

// ==================== API SERVICE CLASS ====================

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Ensure proper headers are set
    const defaultHeaders: Record<string, string> = {};

    // Only set Content-Type for requests with body
    if (options.body && typeof options.body === 'string') {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        const errorPayload = data?.error || data?.message || `HTTP error! status: ${response.status}`;
        console.error('API Error Response:', errorPayload, 'Status:', response.status, 'URL:', url);
        throw new Error(errorPayload);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for URL: ${url}:`, error);
      throw error;
    }
  }

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  // ==================== AUTH ENDPOINTS ====================

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyToken(token: string): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/verify', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async logout(token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async changePassword(passwordData: UpdatePasswordData, token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });
  }

  // ==================== USER ENDPOINTS ====================

  async getAllUsers(token: string): Promise<User[]> {
    return this.request<User[]>('/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserById(id: string, token: string): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateUser(id: string, userData: Partial<User>, token: string): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string, token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== SUPPLIER ENDPOINTS ====================

  async getAllSuppliers(token?: string): Promise<Supplier[]> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<Supplier[]>('/suppliers', {
      method: 'GET',
      headers,
    });
  }

  async getSupplierById(id: string, token?: string): Promise<Supplier> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<Supplier>(`/suppliers/${id}`, {
      method: 'GET',
      headers,
    });
  }

  async createSupplier(supplierData: CreateSupplierData, token: string): Promise<Supplier> {
    return this.request<Supplier>('/suppliers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(supplierData),
    });
  }

  async updateSupplier(id: string, supplierData: UpdateSupplierData, token: string): Promise<Supplier> {
    return this.request<Supplier>(`/suppliers/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(supplierData),
    });
  }

  async deleteSupplier(id: string, token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/suppliers/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== GAS CYLINDER ENDPOINTS ====================

  async getAllGasCylinders(token?: string): Promise<GasCylinder[]> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<GasCylinder[]>('/gas-cylinders', {
      method: 'GET',
      headers,
    });
  }

  async getGasCylinderById(id: string, token?: string): Promise<GasCylinder> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<GasCylinder>(`/gas-cylinders/${id}`, {
      method: 'GET',
      headers,
    });
  }

  async createGasCylinder(cylinderData: CreateGasCylinderData, token: string): Promise<GasCylinder> {
    return this.request<GasCylinder>('/gas-cylinders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cylinderData),
    });
  }

  async updateGasCylinder(id: string, cylinderData: UpdateGasCylinderData, token: string): Promise<GasCylinder> {
    return this.request<GasCylinder>(`/gas-cylinders/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cylinderData),
    });
  }

  async deleteGasCylinder(id: string, token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/gas-cylinders/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== ORDER ENDPOINTS ====================

  async createOrder(orderData: CreateOrderPayload, token: string): Promise<Order> {
    console.log('Creating order with data:', orderData);

    if (!orderData.customerId) throw new Error('Customer ID is required');
    if (!orderData.items || orderData.items.length === 0) throw new Error('Order items are required');
    if (!orderData.deliveryAddress) throw new Error('Delivery address is required');

    return this.request<Order>('/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
  }

  async getAllOrders(token: string, params?: OrderQueryParams): Promise<PaginatedResponse<Order>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.request<PaginatedResponse<Order>>(`/orders${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getOrderById(id: string, token: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateOrder(id: string, orderData: UpdateOrderPayload, token: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
  }

  async deleteOrder(id: string, token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/orders/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Customer specific order endpoints
  async getCustomerOrders(customerId: string, token: string, params?: Omit<OrderQueryParams, 'customerId'>): Promise<PaginatedResponse<Order>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.request<PaginatedResponse<Order>>(`/orders/customer/${customerId}${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Driver specific order endpoints
  async getDriverOrders(driverId: string, token: string, params?: Omit<OrderQueryParams, 'driverId'>): Promise<PaginatedResponse<Order>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.request<PaginatedResponse<Order>>(`/orders/driver/${driverId}${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAvailableOrders(token: string, params?: OrderQueryParams): Promise<PaginatedResponse<Order>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.request<PaginatedResponse<Order>>(`/orders/available${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== STATISTICS ENDPOINTS ====================

  async getOrderStatistics(token: string, startDate?: string, endDate?: string): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    const params: Record<string, string | undefined> = { startDate, endDate };
    const queryString = this.buildQueryString(params);
    return this.request(`/orders/statistics${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getDashboardStats(token: string): Promise<{
    totalCustomers: number;
    totalDrivers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    activeOrders: number;
    lowStockCylinders: number;
  }> {
    return this.request('/dashboard/stats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getOverallDashboardStats(token: string): Promise<{
    totalOrders: number;
    totalGasCylinders: number;
    totalUsers: number;
  }> {
    return this.request('/dashboard/overall-stats', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== UTILITY ENDPOINTS ====================

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health', {
      method: 'GET',
    });
  }

  // File upload endpoint (if needed)
  async uploadFile(file: File, token: string): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<{ url: string; filename: string }>('/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });
  }

   async getAllDrivers(token: string, params?: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<DriverUser>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.request<PaginatedResponse<DriverUser>>(`/users/role/driver${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

    async getDriverStats(driverId: string, token: string): Promise<DriverStats> {
    return this.request<DriverStats>(`/users/drivers/${driverId}/stats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async assignDriverToOrder(
    orderId: string, 
    driverId: string, 
    token: string,
    additionalData?: Omit<AssignDriverPayload, 'driverId'>
  ): Promise<{ message: string, order: Order }> {
    const payload: AssignDriverPayload = {
      driverId,
      ...additionalData
    };

    return this.request<{ message: string, order: Order }>(`/orders/${orderId}/assign-driver`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  }

    /**
   * Unassign driver from order
   */
  async unassignDriverFromOrder(orderId: string, token: string): Promise<Order> {
    return this.request<Order>(`/orders/${orderId}/unassign-driver`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Reassign order to different driver
   */
  async reassignOrderToDriver(
    orderId: string, 
    newDriverId: string, 
    token: string,
    reason?: string
  ): Promise<Order> {
    return this.request<Order>(`/orders/${orderId}/reassign-driver`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        driverId: newDriverId,
        reason 
      }),
    });
  }
    /**
   * Update order status with additional data
   */
  async updateOrderStatusExtended(
    orderId: string, 
    token: string,
    updateData: {
      status: OrderStatus;
      driverId?: string;
      estimatedDeliveryTime?: string;
      actualDeliveryTime?: string;
      specialInstructions?: string;
      reason?: string;
    }
  ): Promise<Order> {
    return this.request<Order>(`/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
  }

  /**
   * Bulk update multiple orders
   */
  async bulkUpdateOrders(
    orderIds: string[], 
    updateData: Partial<UpdateOrderPayload>, 
    token: string
  ): Promise<Order[]> {
    return this.request<Order[]>('/orders/bulk-update', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderIds,
        updateData
      }),
    });
  }
  /**
   * Get orders that can be assigned to drivers
   */
  async getAssignableOrders(token: string, params?: {
    driverId?: string;
    maxDistance?: number;
    priority?: string;
  }): Promise<PaginatedResponse<Order>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.request<PaginatedResponse<Order>>(`/orders/assignable${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== ANALYTICS ENDPOINTS ====================

  /**
   * Get driver performance analytics
   */
  async getDriverAnalytics(
    driverId: string, 
    token: string, 
    params?: {
      startDate?: string;
      endDate?: string;
      period?: 'day' | 'week' | 'month';
    }
  ): Promise<{
    totalDeliveries: number;
    successRate: number;
    averageDeliveryTime: number;
    customerRating: number;
    earningsTotal: number;
  }> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.request(`/analytics/drivers/${driverId}${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Get order assignment analytics
   */
  async getOrderAssignmentAnalytics(
    token: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{
    totalOrders: number;
    assignedOrders: number;
    unassignedOrders: number;
    averageAssignmentTime: number;
    driverUtilization: number;
    assignmentsByStatus: Record<OrderStatus, number>;
  }> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.request(`/analytics/orders/assignments${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  /**
   * Send notification to driver about new assignment
   */
  async notifyDriverAssignment(
    driverId: string, 
    orderId: string, 
    token: string
  ): Promise<{ success: boolean; messageId?: string }> {
    return this.request('/notifications/driver-assignment', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        driverId,
        orderId,
        type: 'order_assigned'
      }),
    });
  }

  /**
   * Send notification to customer about driver assignment
   */
  async notifyCustomerDriverAssigned(
    customerId: string, 
    orderId: string, 
    driverId: string,
    token: string
  ): Promise<{ success: boolean; messageId?: string }> {
    return this.request('/notifications/customer-driver-assigned', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customerId,
        orderId,
        driverId,
        type: 'driver_assigned'
      }),
    });
  }

}

//driver specific endpoints


// ==================== EXPORT ====================

// Export the class for testing or multiple instances
export default ApiService;

// Export singleton instance for general use
export const apiService = new ApiService();