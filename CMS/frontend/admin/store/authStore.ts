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
  return base.endsWith('/') ? base.slice(0, -1) : base;
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
      const response = await axios.post(
        `${getApiUrl()}/api/auth/login`,
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
      const response = await axios.post(`${getApiUrl()}/api/auth/register`, {
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
      await axios.post(`${getApiUrl()}/api/auth/logout`, {}, { withCredentials: true });
    } catch {}
    set({ user: null });
  },

  // Khôi phục session từ cookie
  hydrate: async () => {
    try {
      const res = await axios.get(`${getApiUrl()}/api/auth/verify`, { withCredentials: true });
      const { user } = res.data as { user: User };
      set({ user });
    } catch {
      set({ user: null });
    }
  },
}));

