import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store';
import { updateTokens, logout } from '@/store/slices/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;

        if (!refreshToken) {
          store.dispatch(logout());
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        store.dispatch(updateTokens({ accessToken, refreshToken: newRefreshToken }));
        
        onTokenRefreshed(accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/register', data),
  
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
  
  getMe: () =>
    api.get('/auth/me'),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
};

// User API
export const userApi = {
  getProfile: () =>
    api.get('/users/profile'),
  
  updateProfile: (data: { firstName?: string; lastName?: string; avatar?: string }) =>
    api.patch('/users/profile', data),
  
  getAllUsers: (params?: { search?: string; page?: number; limit?: number }) =>
    api.get('/users', { params }),
  
  getUserById: (id: string) =>
    api.get(`/users/${id}`),
};

// Project API
export const projectApi = {
  getAll: (params?: { page?: number; limit?: number; archived?: boolean }) =>
    api.get('/projects', { params }),
  
  getById: (id: string) =>
    api.get(`/projects/${id}`),
  
  create: (data: { name: string; description?: string; color?: string }) =>
    api.post('/projects', data),
  
  update: (id: string, data: any) =>
    api.patch(`/projects/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/projects/${id}`),
  
  addMember: (projectId: string, userId: string, role?: string) =>
    api.post(`/projects/${projectId}/members`, { userId, role }),
  
  removeMember: (projectId: string, userId: string) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
  
  getStats: (id: string) =>
    api.get(`/projects/${id}/stats`),
};

// Task API
export const taskApi = {
  getByProject: (projectId: string, params?: any) =>
    api.get(`/tasks/project/${projectId}`, { params }),
  
  getMyTasks: (params?: { status?: string; priority?: string }) =>
    api.get('/tasks/my-tasks', { params }),
  
  getById: (id: string) =>
    api.get(`/tasks/${id}`),
  
  create: (data: any) =>
    api.post('/tasks', data),
  
  update: (id: string, data: any) =>
    api.patch(`/tasks/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/tasks/${id}`),
  
  reorder: (tasks: { id: string; position: number; status?: string }[]) =>
    api.post('/tasks/reorder', { tasks }),
};

// Comment API
export const commentApi = {
  getByTask: (taskId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/comments/task/${taskId}`, { params }),
  
  create: (data: { taskId: string; content: string }) =>
    api.post('/comments', data),
  
  update: (id: string, content: string) =>
    api.patch(`/comments/${id}`, { content }),
  
  delete: (id: string) =>
    api.delete(`/comments/${id}`),
};

// File API
export const fileApi = {
  upload: (formData: FormData) =>
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getSignedUploadUrl: (data: { filename: string; contentType: string; projectId?: string; taskId?: string }) =>
    api.post('/files/signed-upload-url', data),
  
  getDownloadUrl: (id: string) =>
    api.get(`/files/${id}/download`),
  
  delete: (id: string) =>
    api.delete(`/files/${id}`),
  
  getByProject: (projectId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/files/project/${projectId}`, { params }),
};

// Notification API
export const notificationApi = {
  getAll: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    api.get('/notifications', { params }),
  
  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`),
  
  markAllAsRead: () =>
    api.post('/notifications/mark-all-read'),
  
  delete: (id: string) =>
    api.delete(`/notifications/${id}`),
};

// Analytics API
export const analyticsApi = {
  getDashboardStats: () =>
    api.get('/analytics/dashboard'),
  
  getProjectAnalytics: (projectId: string) =>
    api.get(`/analytics/project/${projectId}`),
  
  getActivityLogs: (params?: { page?: number; limit?: number; projectId?: string }) =>
    api.get('/analytics/activity', { params }),
};

export default api;
