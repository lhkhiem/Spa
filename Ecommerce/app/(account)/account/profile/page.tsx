'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiSave, FiCamera } from 'react-icons/fi';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import { useAuthStore } from '@/lib/stores/authStore';
import { getUserProfile, updateUserProfile, UpdateProfileData } from '@/lib/api/user';
import toast from 'react-hot-toast';

interface ProfileFormData {
  fullName: string; // Họ và tên (combined)
  email: string;
  phone?: string;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: user?.lastName && user?.firstName 
        ? `${user.lastName} ${user.firstName}`.trim()
        : user?.firstName || user?.lastName || '',
      email: user?.email || '',
      phone: '',
    },
  });

  useEffect(() => {
    let isMounted = true;
    
    const loadProfile = async () => {
      console.log('[Profile] Loading profile...');
      setIsLoading(true);
      
      try {
        const profile = await getUserProfile();
        console.log('[Profile] Profile loaded:', {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
        });
        
        if (!isMounted) return;
        
        // Combine firstName and lastName into fullName for display
        const fullName = profile.lastName && profile.firstName
          ? `${profile.lastName} ${profile.firstName}`.trim()
          : profile.firstName || profile.lastName || '';
        
        // Use phone from profile or fallback to auth store if backend doesn't return it
        const phoneToUse = profile.phone || user?.phone || '';
        console.log('[Profile] Phone handling on load:', {
          profilePhone: profile.phone,
          authStorePhone: user?.phone,
          finalPhone: phoneToUse,
        });
        
        // Reset form with profile data
        reset({
          fullName,
          email: profile.email || '',
          phone: phoneToUse, // Use phone from profile or auth store
        });
        
        // Update auth store with latest profile data
        // Only update if data is different to avoid unnecessary updates
        const needsUpdate = 
          !user ||
          user.firstName !== profile.firstName ||
          user.lastName !== profile.lastName ||
          user.email !== profile.email ||
          user.phone !== phoneToUse;
        
        if (needsUpdate) {
          console.log('[Profile] Updating auth store with profile data');
          updateUser({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: phoneToUse, // Include phone from profile or preserve from auth store
          });
        }
      } catch (error: any) {
        console.error('[Profile] Failed to fetch profile:', error);
        console.error('[Profile] Error details:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        
        if (!isMounted) return;
        
        if (error.response?.status === 401) {
          toast.error('Vui lòng đăng nhập để xem thông tin');
        } else {
          // Fallback to user from auth store if available
          if (user) {
            console.log('[Profile] Using fallback data from auth store');
            const fullName = user.lastName && user.firstName
              ? `${user.lastName} ${user.firstName}`.trim()
              : user.firstName || user.lastName || '';
            reset({
              fullName,
              email: user.email || '',
              phone: '',
            });
          } else {
            console.warn('[Profile] No user data available, form will be empty');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          console.log('[Profile] Profile loading completed');
        }
      }
    };

    // Always try to load profile, API will handle authentication
    loadProfile();
    
    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  const onSubmit = async (data: ProfileFormData) => {
    console.log('[Profile] ========== SUBMITTING PROFILE UPDATE ==========');
    console.log('[Profile] Form data being submitted:', {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
    });
    setIsSaving(true);

    try {
      // Prepare update data - send name field to backend
      const updateData: UpdateProfileData = {
        name: data.fullName.trim(), // Send full name as single field
        email: data.email,
        // Always include phone field if it exists (even if empty string)
        phone: data.phone ? data.phone.trim() : undefined,
      };
      
      console.log('[Profile] Update data prepared:', {
        name: updateData.name,
        email: updateData.email,
        phone: updateData.phone,
        hasPhone: !!updateData.phone,
      });
      
      console.log('[Profile] Sending update data to API:', updateData);
      
      const updatedProfile = await updateUserProfile(updateData);
      console.log('[Profile] ========== PROFILE UPDATE SUCCESS ==========');
      console.log('[Profile] Updated profile received from API:', {
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
      });
      
      // Update auth store with updated profile
      console.log('[Profile] Updating auth store...');
      updateUser({
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        email: updatedProfile.email,
        phone: updatedProfile.phone, // Include phone in auth store update
      });
      console.log('[Profile] Auth store updated with phone:', updatedProfile.phone);

      // Reset form with updated data to ensure consistency
      console.log('[Profile] Resetting form with updated data...');
      const fullName = updatedProfile.lastName && updatedProfile.firstName
        ? `${updatedProfile.lastName} ${updatedProfile.firstName}`.trim()
        : updatedProfile.firstName || updatedProfile.lastName || '';
      reset({
        fullName,
        email: updatedProfile.email,
        phone: updatedProfile.phone || '',
      });
      console.log('[Profile] Form reset completed');

      toast.success('Cập nhật thông tin thành công!');
    } catch (error: any) {
      console.error('[Profile] ========== PROFILE UPDATE ERROR ==========');
      console.error('[Profile] Update profile error:', error);
      console.error('[Profile] Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        url: error?.config?.url,
        baseURL: error?.config?.baseURL,
        requestData: error?.config?.data,
      });
      
      // More detailed error message
      let errorMessage = 'Cập nhật thất bại. Vui lòng thử lại.';
      if (error?.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error.message || error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
      console.log('[Profile] ========== PROFILE UPDATE COMPLETED ==========');
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Account', href: '/account' },
    { label: 'Profile', href: '/account/profile' },
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
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 border-b border-gray-200 pb-6">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-200">
                {user?.lastName || user?.firstName ? (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold text-white">
                    {user.lastName?.[0] || ''}{user.firstName?.[0] || ''}
                  </div>
                ) : (
                  <FiUser className="m-auto h-12 w-12 text-gray-400" />
                )}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-purple-600 text-white shadow-lg transition-colors hover:bg-brand-purple-700"
              >
                <FiCamera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {user?.lastName} {user?.firstName}
              </h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <button
                type="button"
                className="mt-2 text-sm text-brand-purple-600 hover:text-brand-purple-700"
              >
                Thay đổi ảnh đại diện
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Họ và tên"
              type="text"
              placeholder="Nguyễn Văn A"
              leftIcon={<FiUser className="h-5 w-5" />}
              error={errors.fullName?.message}
              required
              {...register('fullName', {
                required: 'Họ và tên là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Họ và tên phải có ít nhất 2 ký tự',
                },
              })}
            />

            <Input
              label="Email"
              type="email"
              placeholder="your.email@example.com"
              leftIcon={<FiMail className="h-5 w-5" />}
              error={errors.email?.message}
              required
              disabled
              {...register('email', {
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ',
                },
              })}
            />

            <Input
              label="Số điện thoại"
              type="tel"
              placeholder="0901234567"
              leftIcon={<FiPhone className="h-5 w-5" />}
              error={errors.phone?.message}
              {...register('phone', {
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: 'Số điện thoại không hợp lệ',
                },
              })}
            />
          </div>

          {/* Password Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Đổi mật khẩu</h3>
            <p className="mb-4 text-sm text-gray-600">
              Để đổi mật khẩu, vui lòng{' '}
              <a href="/forgot-password" className="text-brand-purple-600 hover:underline">
                click vào đây
              </a>
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
            <Button href="/account" variant="outline">
              Hủy
            </Button>
            <Button type="submit" isLoading={isSaving} disabled={isSaving}>
              <FiSave className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


