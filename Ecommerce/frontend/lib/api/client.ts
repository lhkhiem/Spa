import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { getApiUrl } from '@/config/site';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
        const response = await axios.post(`${getApiUrl()}/public/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to handle API errors
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error
      const data = error.response.data;
      
      // Handle specific error codes
      if (data?.code === 'INSUFFICIENT_STOCK') {
        return `Sản phẩm "${data.productName}" không đủ số lượng. Còn lại: ${data.availableStock}, Bạn yêu cầu: ${data.requestedQuantity}`;
      }
      
      // Return error message from server
      return data?.error || data?.message || 'Đã xảy ra lỗi khi xử lý yêu cầu';
    } else if (error.request) {
      // Request made but no response
      return 'Không có phản hồi từ server. Vui lòng kiểm tra kết nối của bạn.';
    }
  }
  return 'Đã xảy ra lỗi không mong muốn';
}
