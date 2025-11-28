'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone } from 'react-icons/fi';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import { useAuthStore } from '@/lib/stores/authStore';
import { register as registerUser } from '@/lib/api/auth';
import { RegisterData } from '@/lib/types/user';
import { cn } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

interface RegisterFormData extends Omit<RegisterData, 'password'> {
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: 'onSubmit', // Only validate on submit, not on change/blur
    reValidateMode: 'onChange', // Re-validate on change after first submit
  });

  const password = watch('password');
  const termsAccepted = watch('termsAccepted');

  const onError = (errors: any) => {
    console.error('[Register] ========== VALIDATION ERRORS ==========');
    console.error('[Register] Form validation errors:', errors);
    console.error('[Register] Form has errors, cannot submit');
    
    // Log current form values to debug
    const currentValues = watch();
    console.error('[Register] Current form values:', {
      firstName: currentValues.firstName,
      lastName: currentValues.lastName,
      email: currentValues.email,
      phone: currentValues.phone,
      password: currentValues.password ? '***' : undefined,
      confirmPassword: currentValues.confirmPassword ? '***' : undefined,
      termsAccepted: currentValues.termsAccepted,
    });
  };

  const onSubmit = async (data: RegisterFormData) => {
    console.log('[Register] ========== FORM SUBMITTED ==========');
    console.log('[Register] Form validation passed!');
    console.log('[Register] Form data:', {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      hasPassword: !!data.password,
      passwordLength: data.password?.length || 0,
      confirmPasswordLength: data.confirmPassword?.length || 0,
      termsAccepted: data.termsAccepted,
    });
    
    setIsLoading(true);

    try {
      const registerData: RegisterData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
      };

      console.log('[Register] Calling registerUser API...');
      const response = await registerUser(registerData);
      console.log('[Register] Register successful!', response);

      setAuth(
        response.user,
        response.accessToken,
        response.refreshToken
      );

      toast.success('Đăng ký thành công!');
      router.push('/account');
    } catch (error: any) {
      console.error('Register error:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        url: error?.config?.url,
        baseURL: error?.config?.baseURL,
      });
      
      // Handle different error types
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
      
      if (error?.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error?.message || errorMessage;
      } else if (error?.request) {
        // Request made but no response (network error)
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else if (error?.message) {
        // Error in request setup
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-[120px] pb-16">
      <div className="container-custom">
        <div className="mx-auto max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/images/banyco-logo.jpg"
                alt="Logo"
                width={150}
                height={75}
                className="mx-auto h-auto w-auto"
              />
            </Link>
          </div>

          {/* Register Card */}
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Đăng ký</h1>
            <p className="mb-8 text-gray-600">
              Tạo tài khoản mới để bắt đầu mua sắm ngay hôm nay.
            </p>

            <form 
              onSubmit={handleSubmit(onSubmit, onError)} 
              className="space-y-5"
              noValidate // Disable HTML5 validation, use react-hook-form validation only
            >
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Họ"
                  type="text"
                  placeholder="Nguyễn"
                  leftIcon={<FiUser className="h-5 w-5" />}
                  error={errors.lastName?.message}
                  {...register('lastName', {
                    required: 'Họ là bắt buộc',
                  })}
                />
                <Input
                  label="Tên"
                  type="text"
                  placeholder="Văn A"
                  leftIcon={<FiUser className="h-5 w-5" />}
                  error={errors.firstName?.message}
                  {...register('firstName', {
                    required: 'Tên là bắt buộc',
                  })}
                />
              </div>

              {/* Email */}
              <Input
                label="Email"
                type="email"
                placeholder="your.email@example.com"
                leftIcon={<FiMail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ',
                  },
                })}
              />

              {/* Phone (Optional) */}
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

              {/* Password */}
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<FiLock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                helperText="Tối thiểu 6 ký tự"
                {...register('password', {
                  required: 'Mật khẩu là bắt buộc',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                  },
                })}
              />

              {/* Confirm Password */}
              <Input
                label="Xác nhận mật khẩu"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<FiLock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Vui lòng xác nhận mật khẩu',
                  validate: (value) =>
                    value === password || 'Mật khẩu xác nhận không khớp',
                })}
              />

              {/* Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className={cn(
                    "mt-1 h-4 w-4 rounded border-gray-300 text-brand-purple-600 focus:ring-brand-purple-500",
                    errors.termsAccepted && "border-red-500"
                  )}
                  {...register('termsAccepted', {
                    required: 'Bạn phải đồng ý với Điều khoản sử dụng và Chính sách bảo mật',
                  })}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  Tôi đồng ý với{' '}
                  <Link href="/terms" className="text-brand-purple-600 hover:underline">
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link href="/privacy" className="text-brand-purple-600 hover:underline">
                    Chính sách bảo mật
                  </Link>
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="mt-1 text-sm text-red-600">{errors.termsAccepted.message}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Đăng ký
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">hoặc</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-brand-purple-600 hover:text-brand-purple-700"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


