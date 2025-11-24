// Store quản lý trạng thái xác thực (Auth)
// - Sử dụng zustand cho state management
// - Lưu trữ thông tin user và token trong localStorage
// - Cung cấp các hàm login, register, logout

import { create } from 'zustand';
import axios from 'axios';
import { resolveApiBaseUrl } from '../lib/api';
interface LoginResponse {
  user: User;
}

interface RegisterResponse {
  user: User;
}

interface User {
  id: string;
  email: string;
  name: string;
  role?: 'owner' | 'admin' | 'editor' | 'author';
}

// Interface định nghĩa store auth
interface AuthStore {
  user: User | null;       // Thông tin user hiện tại
  isLoading: boolean;      // Trạng thái loading
  error: string | null;    // Thông báo lỗi nếu có
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>; // Verify session from cookie
}

const getApiUrl = () => {
  const base = resolveApiBaseUrl();
  // Remove trailing slash if present
  let url = base.endsWith('/') ? base.slice(0, -1) : base;
  // If URL already ends with /api, don't add it again
  // This handles cases where NEXT_PUBLIC_API_URL already includes /api
  return url;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  // Đăng nhập: gửi email + password lên API
  // - Thiết lập cookie HTTP-only từ server
  // - Update state với thông tin user
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = getApiUrl();
      // Check if /api is already in the URL
      const authPath = apiUrl.endsWith('/api') ? '/auth/login' : '/api/auth/login';
      const response = await axios.post(
        `${apiUrl}${authPath}`,
        { email, password },
        { withCredentials: true }
      );
      const { user } = response.data as LoginResponse;
      set({ user, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  // Đăng ký user mới
  // - Gọi API /auth/register
  // - Chỉ lưu thông tin user vào state, không tự động login
  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = getApiUrl();
      const authPath = apiUrl.endsWith('/api') ? '/auth/register' : '/api/auth/register';
      const response = await axios.post(`${apiUrl}${authPath}`, {
        email,
        password,
        name,
      });
        const { user } = response.data as RegisterResponse;
      set({ user, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  // Đăng xuất: gọi API để xóa cookie và xóa user khỏi state
  logout: async () => {
    try {
      const apiUrl = getApiUrl();
      const authPath = apiUrl.endsWith('/api') ? '/auth/logout' : '/api/auth/logout';
      await axios.post(`${apiUrl}${authPath}`, {}, { withCredentials: true });
    } catch {}
    set({ user: null });
  },

  // Khôi phục session từ cookie
  hydrate: async () => {
    try {
      const apiUrl = getApiUrl();
      const authPath = apiUrl.endsWith('/api') ? '/auth/verify' : '/api/auth/verify';
      const res = await axios.get(`${apiUrl}${authPath}`, { withCredentials: true });
      const { user } = res.data as { user: User };
      set({ user });
    } catch {
      set({ user: null });
    }
  },
}));

