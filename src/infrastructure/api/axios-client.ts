import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '../../domain/store/auth-store';

// Create axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Add response time for debugging
    const endTime = new Date();
    const startTime = response.config.metadata?.startTime;
    if (startTime) {
      const duration = endTime.getTime() - startTime.getTime();
      console.debug(`API Request: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await useAuthStore.getState().refreshToken();
        
        // Retry the original request with new token
        const newToken = useAuthStore.getState().getAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear auth state and redirect to login
        useAuthStore.getState().clearAuth();
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    // Handle other errors
    const errorMessage = getErrorMessage(error);
    console.error('API Error:', errorMessage);
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    });
  }
);

// Helper function to extract error message
function getErrorMessage(error: AxiosError): string {
  if (error.response?.data) {
    const data = error.response.data as any;
    
    // Handle different error response formats
    if (typeof data === 'string') {
      return data;
    }
    
    if (data.message) {
      return data.message;
    }
    
    if (data.error) {
      return data.error;
    }
    
    if (data.detail) {
      return data.detail;
    }
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

// API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  total?: number;
  page?: number;
  limit?: number;
}

// Error response wrapper
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Request configuration
export interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  signal?: AbortSignal;
}

// HTTP methods wrapper functions
export const api = {
  get: <T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.get(url, config);
  },
  
  post: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.post(url, data, config);
  },
  
  put: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.put(url, data, config);
  },
  
  patch: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.patch(url, data, config);
  },
  
  delete: <T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return apiClient.delete(url, config);
  },
};

// Utility functions
export const createQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
};

export const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params) return baseUrl;
  
  const queryString = createQueryString(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Request cancellation
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

// File upload helper
export const uploadFile = async (
  url: string, 
  file: File, 
  onProgress?: (progress: number) => void
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
};

// Download file helper
export const downloadFile = async (
  url: string, 
  filename?: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  const response = await apiClient.get(url, {
    responseType: 'blob',
    onDownloadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
  
  const blob = new Blob([response]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export default apiClient; 