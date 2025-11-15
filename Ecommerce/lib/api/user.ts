import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import { User } from '@/lib/types/user';

export interface UserResponse {
  data: User;
}

export interface UpdateProfileData {
  name?: string; // Full name (Họ và tên) - used when backend expects single name field
  firstName?: string; // First name - used when backend expects separate fields
  lastName?: string; // Last name - used when backend expects separate fields
  email: string;
  phone?: string;
  avatar?: string;
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
 * Get user profile
 */
export const getUserProfile = async (): Promise<User> => {
  try {
    console.log('[getUserProfile] Fetching profile from:', API_ENDPOINTS.USER.PROFILE);
    const response = await apiClient.get<UserResponse>(API_ENDPOINTS.USER.PROFILE);
    console.log('[getUserProfile] API response:', response.data);
    console.log('[getUserProfile] Raw profile data:', response.data.data);
    
    const rawData = response.data.data;
    
    // Normalize name fields (handle both 'name' and 'firstName'/'lastName')
    const { firstName, lastName } = normalizeUserName(rawData);
    
    if ((rawData as any).name && (!rawData.firstName && !rawData.lastName)) {
      console.log('[getUserProfile] Backend returned "name" field, split into:', { firstName, lastName });
      console.warn('[getUserProfile] ⚠️ Backend should return "firstName" and "lastName" instead of "name" for consistency with database schema');
    }
    
    // Map to User type
    const user: User = {
      id: rawData.id,
      email: rawData.email,
      firstName,
      lastName,
      phone: rawData.phone || undefined, // Ensure phone is included, even if null/empty
      avatar: rawData.avatar,
      role: rawData.role,
      emailVerified: rawData.emailVerified,
      createdAt: rawData.createdAt,
      updatedAt: rawData.updatedAt,
    };
    
    console.log('[getUserProfile] Mapped profile data:', user);
    console.log('[getUserProfile] Phone value:', {
      rawPhone: rawData.phone,
      mappedPhone: user.phone,
      phoneType: typeof rawData.phone,
    });
    return user;
  } catch (error: any) {
    console.error('[getUserProfile] Error:', error);
    console.error('[getUserProfile] Error details:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
    });
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (data: UpdateProfileData): Promise<User> => {
  try {
    console.log('[updateUserProfile] Updating profile with data:', {
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    });
    console.log('[updateUserProfile] API endpoint:', API_ENDPOINTS.USER.UPDATE_PROFILE);
    console.log('[updateUserProfile] API base URL:', apiClient.defaults.baseURL);
    
    // Prepare request payload - backend expects 'name' field
    const requestPayload: any = {
      email: data.email,
    };
    
    // If name is provided, send it; otherwise send firstName and lastName
    if (data.name) {
      requestPayload.name = data.name;
    } else if (data.firstName || data.lastName) {
      requestPayload.firstName = data.firstName;
      requestPayload.lastName = data.lastName;
    }
    
    // Always send phone if provided
    // IMPORTANT: Backend needs to save phone to database
    if (data.phone !== undefined && data.phone !== null) {
      // Send phone even if it's an empty string (to clear it)
      requestPayload.phone = data.phone.trim() || null;
    } else if (data.phone === '') {
      // Explicitly send null if phone is empty string
      requestPayload.phone = null;
    }
    
    console.log('[updateUserProfile] Phone handling:', {
      inputPhone: data.phone,
      sendingPhone: requestPayload.phone,
      hasPhone: 'phone' in requestPayload,
      requestPayloadKeys: Object.keys(requestPayload),
    });
    
    if (data.avatar !== undefined) {
      requestPayload.avatar = data.avatar;
    }
    
    console.log('[updateUserProfile] Request payload:', requestPayload);
    console.log('[updateUserProfile] Request payload JSON:', JSON.stringify(requestPayload, null, 2));
    console.log('[updateUserProfile] ⚠️ VERIFY: Phone field in request?', {
      hasPhone: 'phone' in requestPayload,
      phoneValue: requestPayload.phone,
      fullPayload: requestPayload,
    });
    
    const response = await apiClient.put<UserResponse>(API_ENDPOINTS.USER.UPDATE_PROFILE, requestPayload);
    
    console.log('[updateUserProfile] Update response:', response.data);
    console.log('[updateUserProfile] Raw profile data:', response.data.data);
    console.log('[updateUserProfile] Raw phone from backend:', {
      phone: response.data.data?.phone,
      phoneType: typeof response.data.data?.phone,
      hasPhone: 'phone' in (response.data.data || {}),
      allKeys: response.data.data ? Object.keys(response.data.data) : [],
    });
    
    const rawData = response.data.data;
    
    // Normalize name fields if needed (handle both 'name' and 'firstName'/'lastName')
    const { firstName, lastName } = normalizeUserName(rawData);
    
    if ((rawData as any).name && (!rawData.firstName && !rawData.lastName)) {
      console.log('[updateUserProfile] Backend returned "name" field, split into:', { firstName, lastName });
    }
    
    // FIX: If backend doesn't return phone, use phone from request payload
    // This handles cases where backend saves phone but doesn't return it in response
    let phone = rawData.phone;
    if (!phone && data.phone) {
      console.warn('[updateUserProfile] ⚠️ Backend did not return phone, using phone from request:', data.phone);
      phone = data.phone.trim() || undefined;
    } else if (!phone && requestPayload.phone) {
      console.warn('[updateUserProfile] ⚠️ Backend did not return phone, using phone from request payload:', requestPayload.phone);
      phone = requestPayload.phone === null ? undefined : requestPayload.phone;
    }
    
    // Map to User type
    const user: User = {
      id: rawData.id,
      email: rawData.email,
      firstName,
      lastName,
      phone: phone || undefined, // Use phone from response or request
      avatar: rawData.avatar,
      role: rawData.role,
      emailVerified: rawData.emailVerified,
      createdAt: rawData.createdAt,
      updatedAt: rawData.updatedAt,
    };
    
    console.log('[updateUserProfile] Mapped profile data:', user);
    console.log('[updateUserProfile] Phone value:', {
      rawPhone: rawData.phone,
      requestPhone: data.phone,
      finalPhone: user.phone,
      phoneType: typeof user.phone,
      phoneSource: rawData.phone ? 'backend' : 'request',
    });
    return user;
  } catch (error: any) {
    console.error('[updateUserProfile] Error:', error);
    console.error('[updateUserProfile] Error details:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
      requestData: error?.config?.data,
    });
    throw error;
  }
};

