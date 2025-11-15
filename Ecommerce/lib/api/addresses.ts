import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import { Address } from '@/lib/types/user';

export interface AddressResponse {
  data: Address[];
}

export interface SingleAddressResponse {
  data: Address;
}

export interface CreateAddressData {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  type: 'shipping' | 'billing' | 'both';
}

export interface UpdateAddressData extends CreateAddressData {}

/**
 * Convert camelCase address data to snake_case for backend API
 * Only includes fields with values (excludes undefined/null for optional fields)
 */
const convertToSnakeCase = (data: CreateAddressData): any => {
  const payload: any = {
    first_name: data.firstName?.trim() || '',
    last_name: data.lastName?.trim() || '',
    address_line1: data.addressLine1?.trim() || '',
    city: data.city?.trim() || '',
    state: data.state?.trim() || '',
    postal_code: data.postalCode?.trim() || '',
    country: data.country?.trim() || '',
    phone: data.phone?.trim() || '',
    is_default: data.isDefault !== undefined ? data.isDefault : false,
    type: data.type || 'both',
  };
  
  // Only include optional fields if they have values
  if (data.company && data.company.trim()) {
    payload.company = data.company.trim();
  }
  
  if (data.addressLine2 && data.addressLine2.trim()) {
    payload.address_line2 = data.addressLine2.trim();
  }
  
  return payload;
};

/**
 * Convert snake_case address data from backend to camelCase for frontend
 */
const convertToCamelCase = (data: any): Address => {
  // Handle both snake_case and camelCase formats
  const address: Address = {
    id: data.id || '',
    userId: data.user_id || data.userId || '',
    firstName: data.first_name || data.firstName || '',
    lastName: data.last_name || data.lastName || '',
    company: data.company,
    addressLine1: data.address_line1 || data.addressLine1 || '',
    addressLine2: data.address_line2 || data.addressLine2,
    city: data.city || '',
    state: data.state || '',
    postalCode: data.postal_code || data.postalCode || '',
    country: data.country || '',
    phone: data.phone || '',
    isDefault: data.is_default !== undefined ? data.is_default : (data.isDefault !== undefined ? data.isDefault : false),
    type: (data.type || 'both') as 'shipping' | 'billing' | 'both',
  };
  
  return address;
};

/**
 * Fetch all addresses for the current user
 */
export const fetchAddresses = async (): Promise<Address[]> => {
  try {
    console.log('[fetchAddresses] Fetching addresses from:', API_ENDPOINTS.USER.ADDRESSES);
    console.log('[fetchAddresses] API base URL:', apiClient.defaults.baseURL);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    console.log('[fetchAddresses] Access token:', token ? 'Present' : 'Missing');
    
    const response = await apiClient.get<any>(API_ENDPOINTS.USER.ADDRESSES);
    
    console.log('[fetchAddresses] Raw addresses response:', response.data);
    console.log('[fetchAddresses] Response structure:', {
      hasData: !!response.data,
      hasDataData: !!response.data?.data,
      dataType: Array.isArray(response.data?.data) ? 'array' : typeof response.data?.data,
      dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'N/A',
    });
    
    // Handle different response structures
    let rawAddresses: any[] = [];
    if (Array.isArray(response.data)) {
      // Response is directly an array
      rawAddresses = response.data;
    } else if (Array.isArray(response.data?.data)) {
      // Response has data.data structure
      rawAddresses = response.data.data;
    } else if (response.data?.data && typeof response.data.data === 'object') {
      // Single address object
      rawAddresses = [response.data.data];
    }
    
    console.log('[fetchAddresses] Raw addresses array:', rawAddresses);
    console.log('[fetchAddresses] Addresses count:', rawAddresses.length);
    
    // Normalize response from snake_case to camelCase (if needed)
    const addresses = rawAddresses.map((addr: any) => {
      try {
        return convertToCamelCase(addr);
      } catch (error) {
        console.error('[fetchAddresses] Error normalizing address:', addr, error);
        // Return as-is if normalization fails
        return addr;
      }
    });
    
    console.log('[fetchAddresses] Normalized addresses:', addresses);
    
    return addresses;
  } catch (error: any) {
    console.error('[fetchAddresses] Error:', error);
    console.error('[fetchAddresses] Error details:', {
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
 * Get a single address by ID
 */
export const fetchAddress = async (addressId: string): Promise<Address> => {
  const response = await apiClient.get<SingleAddressResponse>(
    API_ENDPOINTS.USER.ADDRESSES + `/${addressId}`
  );
  return response.data.data;
};

/**
 * Create a new address
 */
export const createAddress = async (data: CreateAddressData): Promise<Address> => {
  try {
    console.log('[createAddress] ========== CREATING ADDRESS ==========');
    console.log('[createAddress] Creating address with data:', {
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      phone: data.phone,
      isDefault: data.isDefault,
      type: data.type,
    });
    console.log('[createAddress] API endpoint:', API_ENDPOINTS.USER.ADD_ADDRESS);
    console.log('[createAddress] API base URL:', apiClient.defaults.baseURL);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    console.log('[createAddress] Access token:', token ? 'Present' : 'Missing');
    
    // Convert camelCase to snake_case for backend
    const requestPayload = convertToSnakeCase(data);
    console.log('[createAddress] Request payload (snake_case):', requestPayload);
    console.log('[createAddress] Request payload JSON:', JSON.stringify(requestPayload, null, 2));
    
    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'address_line1', 'city', 'state', 'postal_code', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !requestPayload[field] || requestPayload[field].trim() === '');
    if (missingFields.length > 0) {
      console.error('[createAddress] Missing required fields:', missingFields);
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    const response = await apiClient.post<SingleAddressResponse>(
      API_ENDPOINTS.USER.ADD_ADDRESS,
      requestPayload
    );
    
    console.log('[createAddress] ========== ADDRESS CREATED SUCCESSFULLY ==========');
    console.log('[createAddress] Raw response:', response.data);
    console.log('[createAddress] Raw address data:', response.data.data);
    
    // Normalize response from snake_case to camelCase
    const address = convertToCamelCase(response.data.data);
    console.log('[createAddress] Normalized address:', address);
    
    return address;
  } catch (error: any) {
    console.error('[createAddress] ========== ADDRESS CREATION ERROR ==========');
    console.error('[createAddress] Error:', error);
    console.error('[createAddress] Error code:', error?.code);
    console.error('[createAddress] Error details:', {
      message: error?.message,
      code: error?.code,
      response: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
      fullURL: error?.config?.baseURL + error?.config?.url,
      requestData: error?.config?.data,
      requestDataString: error?.config?.data ? JSON.stringify(error.config.data) : null,
      headers: error?.config?.headers,
    });
    
    // Check for network errors
    if (error?.code === 'ERR_NETWORK' || error?.code === 'ERR_CONNECTION_REFUSED' || error?.message === 'Network Error') {
      console.error('[createAddress] ⚠️ NETWORK ERROR - Backend server may not be running');
      console.error('[createAddress] API URL:', apiClient.defaults.baseURL);
      console.error('[createAddress] Full URL:', apiClient.defaults.baseURL + API_ENDPOINTS.USER.ADD_ADDRESS);
      console.error('[createAddress] Please check if backend server is running on port 3011');
    }
    
    // Log response body if available
    if (error?.response?.data) {
      console.error('[createAddress] Response body:', error.response.data);
      console.error('[createAddress] Response body stringified:', JSON.stringify(error.response.data));
    }
    
    // Log request payload for debugging
    if (error?.config?.data) {
      try {
        const requestPayload = typeof error.config.data === 'string' 
          ? JSON.parse(error.config.data) 
          : error.config.data;
        console.error('[createAddress] Request payload that failed:', requestPayload);
      } catch (e) {
        console.error('[createAddress] Could not parse request data:', error.config.data);
      }
    }
    
    throw error;
  }
};

/**
 * Update an existing address
 */
export const updateAddress = async (
  addressId: string,
  data: UpdateAddressData
): Promise<Address> => {
  try {
    console.log('[updateAddress] ========== UPDATING ADDRESS ==========');
    console.log('[updateAddress] Updating address:', addressId);
    console.log('[updateAddress] Update data:', {
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      phone: data.phone,
      isDefault: data.isDefault,
      type: data.type,
    });
    console.log('[updateAddress] API endpoint:', API_ENDPOINTS.USER.UPDATE_ADDRESS(addressId));
    console.log('[updateAddress] API base URL:', apiClient.defaults.baseURL);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    console.log('[updateAddress] Access token:', token ? 'Present' : 'Missing');
    
    // Convert camelCase to snake_case for backend
    const requestPayload = convertToSnakeCase(data);
    console.log('[updateAddress] Request payload (snake_case):', requestPayload);
    console.log('[updateAddress] Request payload JSON:', JSON.stringify(requestPayload, null, 2));
    
    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'address_line1', 'city', 'state', 'postal_code', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !requestPayload[field] || requestPayload[field].trim() === '');
    if (missingFields.length > 0) {
      console.error('[updateAddress] Missing required fields:', missingFields);
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    const response = await apiClient.put<SingleAddressResponse>(
      API_ENDPOINTS.USER.UPDATE_ADDRESS(addressId),
      requestPayload
    );
    
    console.log('[updateAddress] ========== ADDRESS UPDATED SUCCESSFULLY ==========');
    console.log('[updateAddress] Raw response:', response.data);
    console.log('[updateAddress] Raw address data:', response.data.data);
    
    // Normalize response from snake_case to camelCase
    const address = convertToCamelCase(response.data.data);
    console.log('[updateAddress] Normalized address:', address);
    
    return address;
  } catch (error: any) {
    console.error('[updateAddress] ========== ADDRESS UPDATE ERROR ==========');
    console.error('[updateAddress] Error:', error);
    console.error('[updateAddress] Error details:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
      requestData: error?.config?.data,
      headers: error?.config?.headers,
    });
    throw error;
  }
};

/**
 * Delete an address
 */
export const deleteAddress = async (addressId: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.USER.DELETE_ADDRESS(addressId));
};

