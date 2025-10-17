'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'admin' | 'driver' | 'client';
  isVerified: boolean;
  profileImage?: {
    url: string;
    publicId: string;
  };
  notificationSettings: {
    parcelUpdates: boolean;
    driverAssigned: boolean;
    paymentConfirmations: boolean;
    promotionalMessages: boolean;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; data?: any }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>;
  verifyResetToken: (token: string) => Promise<{ success: boolean; message: string; data?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        console.log('AuthContext: Checking authentication...');
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('AuthContext: Token exists:', !!token, 'User data exists:', !!userData);
        
        if (token && userData) {
          // Set token in API client
          apiClient.setToken(token);
          
          // Verify token is still valid
          console.log('AuthContext: Verifying token...');
          const response = await apiClient.getProfile();
          console.log('AuthContext: Profile response:', response);
          
          if (response.success && response.data?.user) {
            console.log('AuthContext: User authenticated successfully');
            setUser(response.data.user);
          } else {
            console.log('AuthContext: Token invalid, clearing...');
            // Token is invalid, clear it
            apiClient.clearToken();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } else {
          console.log('AuthContext: No token or user data found');
        }
      } catch (error) {
        console.error('AuthContext: Auth check failed:', error);
        apiClient.clearToken();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting login...');
      const response = await apiClient.login(email, password);
      console.log('AuthContext: Login response:', response);
      
      if (response.success && response.data?.user) {
        console.log('AuthContext: Login successful, setting user and token');
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true, message: 'Login successful' };
      } else {
        console.log('AuthContext: Login failed:', response.message);
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const register = async (userData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role?: string;
  }) => {
    try {
      const response = await apiClient.register(userData);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      apiClient.clearToken();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await apiClient.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return { success: true, message: 'Profile updated successfully' };
      } else {
        return { success: false, message: response.message || 'Profile update failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Profile update failed' 
      };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await apiClient.request('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.success) {
        return { success: true, message: 'Password changed successfully' };
      } else {
        return { success: false, message: response.message || 'Password change failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Password change failed' 
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await apiClient.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      return { 
        success: response.success, 
        message: response.message || 'Failed to send reset email',
        data: response.data
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send reset email' 
      };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await apiClient.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });

      return { 
        success: response.success, 
        message: response.message || 'Failed to reset password' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to reset password' 
      };
    }
  };

  const verifyResetToken = async (token: string) => {
    try {
      const response = await apiClient.request(`/auth/reset-password?token=${token}`, {
        method: 'GET',
      });

      return { 
        success: response.success, 
        message: response.message || 'Failed to verify reset token',
        data: response.data
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to verify reset token' 
      };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyResetToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
