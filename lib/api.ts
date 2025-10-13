// API configuration and utility functions for connecting frontend to Next.js API routes

const API_BASE_URL = '/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(userData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role?: string;
  }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async registerAdmin(userData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) {
    const response = await this.request('/auth/register-admin', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.clearToken();
    return response;
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getDashboardAnalytics(period = '30d') {
    return this.request(`/dashboard/analytics?period=${period}`);
  }

  async getNotifications() {
    return this.request('/dashboard/notifications');
  }

  // Users endpoints
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/users?${searchParams.toString()}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUserRole(id: string, role: string) {
    return this.request(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    });
  }

  // Drivers endpoints
  async getDrivers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    isOnline?: boolean;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/drivers?${searchParams.toString()}`);
  }

  async getDriver(id: string) {
    return this.request(`/drivers/${id}`);
  }

  async updateDriverStatus(id: string, status: string, suspensionReason?: string) {
    return this.request(`/drivers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, suspensionReason }),
    });
  }

  async updateDriver(id: string, driverData: any) {
    return this.request(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(driverData),
    });
  }

  async updateDriver(id: string, driverData: any) {
    return this.request(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(driverData),
    });
  }

  async deleteDriver(id: string) {
    return this.request(`/drivers/${id}`, {
      method: 'DELETE',
    });
  }

  // Parcels endpoints
  async getParcels(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/parcels?${searchParams.toString()}`);
  }

  async getParcel(id: string) {
    return this.request(`/parcels/${id}`);
  }

  async updateParcelStatus(id: string, status: string, cancellationReason?: string) {
    return this.request(`/parcels/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, cancellationReason }),
    });
  }

  async assignParcel(id: string, driverId: string) {
    return this.request(`/parcels/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ driverId }),
    });
  }

  // Applications endpoints
  async getApplications(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/admin/applications?${searchParams.toString()}`);
  }

  async getApplication(id: string) {
    return this.request(`/admin/applications/${id}`);
  }

  async reviewApplication(id: string, status: string, reviewNotes?: string, rejectionReason?: string) {
    return this.request(`/admin/applications/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify({ status, reviewNotes, rejectionReason }),
    });
  }

  // Payments endpoints
  async getPayments(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/admin/payments?${searchParams.toString()}`);
  }

  async processPayment(id: string, status: string, transactionId?: string, failureReason?: string) {
    return this.request(`/admin/payments/${id}/process`, {
      method: 'PUT',
      body: JSON.stringify({ status, transactionId, failureReason }),
    });
  }

  async generatePayments(periodStart: string, periodEnd: string, driverIds?: string[]) {
    return this.request('/admin/payments/generate', {
      method: 'POST',
      body: JSON.stringify({ periodStart, periodEnd, driverIds }),
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types for TypeScript
export type { ApiResponse };
