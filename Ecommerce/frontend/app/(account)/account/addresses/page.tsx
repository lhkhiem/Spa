'use client';

import { useState, useEffect } from 'react';

// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic';
import { useForm } from 'react-hook-form';
import { FiMapPin, FiPlus, FiEdit, FiTrash2, FiCheck } from 'react-icons/fi';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import toast from 'react-hot-toast';
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  CreateAddressData,
} from '@/lib/api/addresses';
import { Address } from '@/lib/types/user';

interface AddressFormData {
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

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      country: 'Việt Nam',
      isDefault: false,
      type: 'both',
    },
  });

  // Handle form validation errors
  const onError = (errors: any) => {
    console.error('[AddressesPage] ========== VALIDATION ERRORS ==========');
    console.error('[AddressesPage] Form validation errors:', errors);
    console.error('[AddressesPage] Form has errors, cannot submit');
    
    // Show first error message
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error(firstError.message);
    } else {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
    }
  };

  useEffect(() => {
    const loadAddresses = async () => {
      console.log('[AddressesPage] Loading addresses...');
      setIsLoading(true);
      
      try {
        const data = await fetchAddresses();
        console.log('[AddressesPage] Addresses loaded:', data);
        setAddresses(data || []);
      } catch (error: any) {
        console.error('[AddressesPage] Failed to fetch addresses:', error);
        console.error('[AddressesPage] Error details:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        
        // Don't show error toast if it's just an empty list (404 or empty response)
        if (error.response?.status === 401) {
          toast.error('Vui lòng đăng nhập để xem địa chỉ');
        } else if (error.response?.status === 404) {
          // No addresses yet, that's okay
          console.log('[AddressesPage] No addresses found (404), setting empty array');
          setAddresses([]);
        } else if (error.response?.status === 500) {
          // Server error - might be backend issue
          console.error('[AddressesPage] Server error when fetching addresses');
          // Still set empty array to show empty state
          setAddresses([]);
          // Optionally show error toast
          // toast.error('Lỗi server khi tải địa chỉ. Vui lòng thử lại sau.');
        } else {
          // Other errors
          setAddresses([]);
          // toast.error('Không thể tải danh sách địa chỉ');
        }
      } finally {
        setIsLoading(false);
        console.log('[AddressesPage] Address loading completed');
      }
    };

    loadAddresses();
  }, []);

  const onSubmit = async (data: AddressFormData) => {
    console.log('[AddressesPage] ========== FORM SUBMITTED ==========');
    console.log('[AddressesPage] Form data:', {
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
    console.log('[AddressesPage] Editing ID:', editingId);
    
    setIsSaving(true);

    try {
      if (editingId) {
        console.log('[AddressesPage] Updating address:', editingId);
        const updatedAddress = await updateAddress(editingId, data);
        console.log('[AddressesPage] Address updated successfully:', updatedAddress);
        setAddresses(addresses.map((addr) => 
          addr.id === editingId ? updatedAddress : addr
        ));
        toast.success('Cập nhật địa chỉ thành công!');
      } else {
        console.log('[AddressesPage] Creating new address');
        const newAddress = await createAddress(data);
        console.log('[AddressesPage] Address created successfully:', newAddress);
        setAddresses([...addresses, newAddress]);
        toast.success('Thêm địa chỉ thành công!');
      }

      reset({
        country: 'Việt Nam',
        isDefault: false,
        type: 'both',
      });
      setIsFormOpen(false);
      setEditingId(null);
      console.log('[AddressesPage] ========== FORM SUBMITTED SUCCESSFULLY ==========');
    } catch (error: any) {
      console.error('[AddressesPage] ========== FORM SUBMIT ERROR ==========');
      console.error('[AddressesPage] Save address error:', error);
      console.error('[AddressesPage] Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        url: error?.config?.url,
        baseURL: error?.config?.baseURL,
      });
      
      // More detailed error message
      let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
      
      // Check response data for error message
      if (error?.response?.data) {
        // Handle different error response formats
        if (error.response.data.error) {
          // Backend returned {error: "message"}
          if (typeof error.response.data.error === 'string') {
            errorMessage = error.response.data.error;
          } else if (error.response.data.error.message) {
            errorMessage = error.response.data.error.message;
          }
        } else if (error.response.data.message) {
          // Backend returned {message: "error"}
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          // Backend returned string
          errorMessage = error.response.data;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Handle specific status codes and network errors
      if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
        // Network error - server not running or connection refused
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra xem backend server đã chạy chưa.';
      } else if (error?.code === 'ERR_CONNECTION_REFUSED') {
        errorMessage = 'Kết nối bị từ chối. Vui lòng kiểm tra xem backend server đã chạy chưa.';
      } else if (error?.response?.status === 401) {
        errorMessage = 'Vui lòng đăng nhập để thêm địa chỉ';
      } else if (error?.response?.status === 500) {
        // Show backend error message if available, otherwise generic message
        if (error?.response?.data?.error) {
          errorMessage = `Lỗi server: ${error.response.data.error}`;
        } else {
          errorMessage = 'Lỗi server khi thêm địa chỉ. Vui lòng kiểm tra lại thông tin và thử lại.';
        }
      } else if (error?.response?.status === 400) {
        errorMessage = errorMessage || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
      } else if (error?.response?.status === 404) {
        errorMessage = 'API endpoint không tồn tại. Vui lòng liên hệ hỗ trợ.';
      }
      
      console.error('[AddressesPage] Final error message:', errorMessage);
      console.error('[AddressesPage] Error code:', error?.code);
      console.error('[AddressesPage] Full error:', error);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (address: Address) => {
    reset(address);
    setEditingId(address.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return;
    }

    try {
      await deleteAddress(id);
      setAddresses(addresses.filter((addr) => addr.id !== id));
      toast.success('Xóa địa chỉ thành công!');
    } catch (error: any) {
      console.error('Delete address error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Xóa địa chỉ thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    }
  };

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Tài khoản', href: '/account' },
    { label: 'Địa chỉ', href: '/account/addresses' },
  ];

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Địa chỉ của tôi</h1>
          {!isFormOpen && (
            <Button onClick={() => setIsFormOpen(true)}>
              <FiPlus className="mr-2 h-4 w-4" />
              Thêm địa chỉ mới
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {isFormOpen && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              {editingId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </h2>
            <form 
              onSubmit={handleSubmit(onSubmit, onError)} 
              className="space-y-4"
              noValidate
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Họ"
                  type="text"
                  error={errors.lastName?.message}
                  required
                  {...register('lastName', { required: 'Họ là bắt buộc' })}
                />
                <Input
                  label="Tên"
                  type="text"
                  error={errors.firstName?.message}
                  required
                  {...register('firstName', { required: 'Tên là bắt buộc' })}
                />
              </div>

              <Input
                label="Công ty (tùy chọn)"
                type="text"
                {...register('company')}
              />

              <Input
                label="Địa chỉ"
                type="text"
                error={errors.addressLine1?.message}
                required
                {...register('addressLine1', { required: 'Địa chỉ là bắt buộc' })}
              />

              <Input
                label="Địa chỉ 2 (tùy chọn)"
                type="text"
                {...register('addressLine2')}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Input
                  label="Thành phố"
                  type="text"
                  error={errors.city?.message}
                  required
                  {...register('city', { required: 'Thành phố là bắt buộc' })}
                />
                <Input
                  label="Tỉnh/Thành"
                  type="text"
                  error={errors.state?.message}
                  required
                  {...register('state', { required: 'Tỉnh/Thành là bắt buộc' })}
                />
                <Input
                  label="Mã bưu điện"
                  type="text"
                  error={errors.postalCode?.message}
                  required
                  {...register('postalCode', { required: 'Mã bưu điện là bắt buộc' })}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Quốc gia"
                  type="text"
                  error={errors.country?.message}
                  required
                  {...register('country', { required: 'Quốc gia là bắt buộc' })}
                />
                <Input
                  label="Số điện thoại"
                  type="tel"
                  error={errors.phone?.message}
                  required
                  {...register('phone', { required: 'Số điện thoại là bắt buộc' })}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isDefault')}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-brand-purple-600"
                  />
                  <span className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</span>
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    reset();
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit" isLoading={isSaving} disabled={isSaving}>
                  <FiCheck className="mr-2 h-4 w-4" />
                  {editingId ? 'Cập nhật' : 'Thêm địa chỉ'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="py-12 text-center">
            <FiMapPin className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Chưa có địa chỉ nào
            </h3>
            <p className="mb-6 text-gray-600">
              Thêm địa chỉ để đơn hàng được giao nhanh chóng hơn.
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <FiPlus className="mr-2 h-4 w-4" />
              Thêm địa chỉ đầu tiên
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`rounded-lg border-2 p-6 ${
                  address.isDefault
                    ? 'border-brand-purple-600 bg-purple-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="h-5 w-5 text-brand-purple-600" />
                    {address.isDefault && (
                      <span className="rounded-full bg-brand-purple-600 px-2 py-1 text-xs font-semibold text-white">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                    >
                      <FiEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                  <p className="font-semibold">
                    {address.lastName} {address.firstName}
                  </p>
                  {address.company && <p>{address.company}</p>}
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                  <p className="mt-2">{address.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


