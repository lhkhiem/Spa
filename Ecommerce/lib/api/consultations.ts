import apiClient from './client';

export interface ConsultationFormData {
  name: string;
  phone: string;
  email?: string;
  province: string;
  message?: string;
}

export interface ConsultationSubmission {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  province: string;
  message: string | null;
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

export interface ConsultationResponse {
  success: boolean;
  message?: string;
  id?: string;
  error?: string;
}

export interface ConsultationListResponse {
  success: boolean;
  data: ConsultationSubmission[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Submit consultation form (public)
export async function submitConsultationForm(data: ConsultationFormData): Promise<ConsultationResponse> {
  const response = await apiClient.post<ConsultationResponse>('/consultations', data);
  return response.data;
}

// Get consultation submissions (admin - requires auth)
export async function getConsultationSubmissions(params?: {
  status?: string;
  province?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}): Promise<ConsultationListResponse> {
  const response = await apiClient.get<ConsultationListResponse>('/consultations', { params });
  return response.data;
}

// Get consultation submission by ID (admin)
export async function getConsultationSubmission(id: string): Promise<{ success: boolean; data: ConsultationSubmission }> {
  const response = await apiClient.get<{ success: boolean; data: ConsultationSubmission }>(`/consultations/${id}`);
  return response.data;
}

// Update consultation submission (admin)
export async function updateConsultationSubmission(
  id: string,
  data: {
    status?: string;
    assigned_to?: string | null;
    reply_message?: string;
  }
): Promise<{ success: boolean; message: string; data: ConsultationSubmission }> {
  const response = await apiClient.put<{ success: boolean; message: string; data: ConsultationSubmission }>(
    `/consultations/${id}`,
    data
  );
  return response.data;
}

// Delete consultation submission (admin)
export async function deleteConsultationSubmission(id: string): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{ success: boolean; message: string }>(`/consultations/${id}`);
  return response.data;
}

// Get consultation statistics (admin)
export async function getConsultationStats(): Promise<{
  success: boolean;
  data: {
    total: number;
    new_count: number;
    read_count: number;
    replied_count: number;
    archived_count: number;
    last_7_days: number;
    last_30_days: number;
    byProvince: Array<{ province: string; count: number }>;
  };
}> {
  const response = await apiClient.get('/consultations/stats');
  return response.data;
}

