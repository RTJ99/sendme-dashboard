import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface DashboardStats {
  overview: {
    totalUsers: number;
    totalDrivers: number;
    totalClients: number;
    activeDrivers: number;
    pendingApplications: number;
    totalParcels: number;
    totalRevenue: number;
    pendingPayments: number;
  };
  applications: {
    totalApplications: number;
    pendingApplications: number;
    underReviewApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    onHoldApplications: number;
  };
  parcels: {
    totalParcels: number;
    totalRevenue: number;
    totalCommission: number;
    totalPlatformFee: number;
    pendingParcels: number;
    activeParcels: number;
    completedParcels: number;
    cancelledParcels: number;
  };
  payments: {
    totalPayments: number;
    totalAmount: number;
    totalNetAmount: number;
    totalPlatformFee: number;
    pendingPayments: number;
    processingPayments: number;
    completedPayments: number;
    failedPayments: number;
    pendingAmount: number;
  };
  monthlyRevenue: Array<{
    _id: { year: number; month: number };
    revenue: number;
    trips: number;
  }>;
  topDrivers: Array<{
    fullName: string;
    email: string;
    totalTrips: number;
    rating: number;
    totalEarnings: number;
    isOnline: boolean;
  }>;
  recentActivity: {
    applications: Array<any>;
    parcels: Array<any>;
  };
}

interface Notification {
  type: string;
  message: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, notificationsResponse] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getNotifications()
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data.notifications);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    notifications,
    loading,
    error,
    refetch: fetchDashboardData
  };
};

export const useDrivers = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  isOnline?: boolean;
} = {}) => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getDrivers(params);

      if (response.success) {
        setDrivers(response.data.drivers);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [params.page, params.limit, params.search, params.status, params.isOnline]);

  return {
    drivers,
    pagination,
    loading,
    error,
    refetch: fetchDrivers
  };
};

export const useApplications = (params: {
  page?: number;
  limit?: number;
  status?: string;
} = {}) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getApplications(params);

      if (response.success) {
        setApplications(response.data.applications);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [params.page, params.limit, params.status]);

  return {
    applications,
    pagination,
    loading,
    error,
    refetch: fetchApplications
  };
};

export const useParcels = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
} = {}) => {
  const [parcels, setParcels] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParcels = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getParcels(params);

      if (response.success) {
        setParcels(response.data.parcels);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch parcels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, [params.page, params.limit, params.search, params.status, params.paymentStatus, params.dateFrom, params.dateTo]);

  return {
    parcels,
    pagination,
    loading,
    error,
    refetch: fetchParcels
  };
};

export const usePayments = (params: {
  page?: number;
  limit?: number;
  status?: string;
} = {}) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getPayments(params);

      if (response.success) {
        setPayments(response.data.payments);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [params.page, params.limit, params.status]);

  return {
    payments,
    pagination,
    loading,
    error,
    refetch: fetchPayments
  };
};

export const useUsers = (params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
} = {}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getUsers(params);

      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [params.page, params.limit, params.search, params.role]);

  return {
    users,
    pagination,
    loading,
    error,
    refetch: fetchUsers
  };
};