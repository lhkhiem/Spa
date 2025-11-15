import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import { User, LoginCredentials, RegisterData } from '@/lib/types/user';

export interface AuthResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
  };
}

export interface UserResponse {
  data: User;
}

export interface RefreshTokenResponse {
  data: {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
  };
}

/**
 * Helper function to normalize user name fields
 * Handles both cases: backend returns 'name' or 'firstName'/'lastName'
 */
const normalizeUserName = (rawData: any): { firstName: string; lastName: string } => {
  // If backend returns firstName and lastName directly, use them
  if (rawData.firstName || rawData.lastName) {
    return {
      firstName: rawData.firstName || '',
      lastName: rawData.lastName || '',
    };
  }
  
  // If backend returns 'name' field, split it into firstName and lastName
  // Vietnamese name convention: Last name first (e.g., "Nguyễn Văn A" -> lastName: "Nguyễn", firstName: "Văn A")
  if ((rawData as any).name) {
    const nameParts = (rawData as any).name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      return {
        lastName: nameParts[0], // First part is usually last name in Vietnamese
        firstName: nameParts.slice(1).join(' '), // Rest is first name
      };
    } else if (nameParts.length === 1) {
      return {
        firstName: nameParts[0],
        lastName: '',
      };
    }
  }
  
  // Default fallback
  return {
    firstName: '',
    lastName: '',
  };
};

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse['data']> => {
  try {
    console.log('[login] Logging in with email:', credentials.email);
    console.log('[login] API endpoint:', API_ENDPOINTS.AUTH.LOGIN);
    console.log('[login] API base URL:', apiClient.defaults.baseURL);
    
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    console.log('[login] Login response:', response.data);
    
    // Normalize user name fields if needed
    const rawUser = response.data.data.user as any;
    if ((rawUser as any).name && (!rawUser.firstName && !rawUser.lastName)) {
      const { firstName, lastName } = normalizeUserName(rawUser);
      response.data.data.user = {
        ...response.data.data.user,
        firstName,
        lastName,
      };
      console.log('[login] Normalized user name from "name" field:', { firstName, lastName });
      console.warn('[login] ⚠️ Backend should return "firstName" and "lastName" instead of "name" for consistency');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('[login] Login error details:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
      fullURL: error?.config?.baseURL + error?.config?.url,
    });
    throw error;
  }
};

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse['data']> => {
  try {
    console.log('[register] Registering user with data:', {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      hasPassword: !!data.password,
    });
    console.log('[register] API endpoint:', API_ENDPOINTS.AUTH.REGISTER);
    console.log('[register] API base URL:', apiClient.defaults.baseURL);
    
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || undefined,
    });
    
    console.log('[register] Register response:', response.data);
    
    // Normalize user name fields if needed
    const rawUser = response.data.data.user as any;
    if ((rawUser as any).name && (!rawUser.firstName && !rawUser.lastName)) {
      const { firstName, lastName } = normalizeUserName(rawUser);
      response.data.data.user = {
        ...response.data.data.user,
        firstName,
        lastName,
      };
      console.log('[register] Normalized user name from "name" field:', { firstName, lastName });
      console.warn('[register] ⚠️ Backend should return "firstName" and "lastName" instead of "name" for consistency');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('[register] Register error details:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
      fullURL: error?.config?.baseURL + error?.config?.url,
    });
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
    // Continue with logout even if API call fails
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse['data']> => {
  const response = await apiClient.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH, {
    refreshToken,
  });
  return response.data.data;
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<UserResponse>(API_ENDPOINTS.AUTH.ME);
  
  // Normalize user name fields if needed
  const rawData = response.data.data as any;
  if ((rawData as any).name && (!rawData.firstName && !rawData.lastName)) {
    const { firstName, lastName } = normalizeUserName(rawData);
    console.log('[getCurrentUser] Normalized user name from "name" field:', { firstName, lastName });
    console.warn('[getCurrentUser] ⚠️ Backend should return "firstName" and "lastName" instead of "name" for consistency');
    return {
      ...response.data.data,
      firstName,
      lastName,
    };
  }
  
  return response.data.data;
};

/**
 * Forgot password
 */
export const forgotPassword = async (email: string): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
};

/**
 * Reset password
 */
export const resetPassword = async (token: string, password: string): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
};

/**
 * Verify email
 */
export const verifyEmail = async (token: string): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
};

