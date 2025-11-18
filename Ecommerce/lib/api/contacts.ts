import apiClient from './client';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  assigned_to: string | null;
  replied_at: string | null;
  replied_by: string | null;
  reply_message: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
  assigned_to_name?: string;
  replied_by_name?: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  id?: string;
  error?: string;
}

export interface ContactListResponse {
  success: boolean;
  data: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Submit contact form (public)
export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
  const response = await apiClient.post<ContactResponse>('/contacts', data);
  return response.data;
}

// Get contact messages (admin - requires auth)
export async function getContactMessages(params?: {
  status?: string;
  subject?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}): Promise<ContactListResponse> {
  const response = await apiClient.get<ContactListResponse>('/contacts', { params });
  return response.data;
}

// Get contact message by ID (admin)
export async function getContactMessage(id: string): Promise<{ success: boolean; data: ContactMessage }> {
  const response = await apiClient.get<{ success: boolean; data: ContactMessage }>(`/contacts/${id}`);
  return response.data;
}

// Update contact message (admin)
export async function updateContactMessage(
  id: string,
  data: {
    status?: string;
    assigned_to?: string | null;
    reply_message?: string;
  }
): Promise<{ success: boolean; message: string; data: ContactMessage }> {
  const response = await apiClient.put<{ success: boolean; message: string; data: ContactMessage }>(
    `/contacts/${id}`,
    data
  );
  return response.data;
}

// Delete contact message (admin)
export async function deleteContactMessage(id: string): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{ success: boolean; message: string }>(`/contacts/${id}`);
  return response.data;
}

// Get contact statistics (admin)
export async function getContactStats(): Promise<{
  success: boolean;
  data: {
    total: number;
    new_count: number;
    read_count: number;
    replied_count: number;
    archived_count: number;
    last_7_days: number;
    last_30_days: number;
    bySubject: Array<{ subject: string; count: number }>;
  };
}> {
  const response = await apiClient.get('/contacts/stats');
  return response.data;
}

