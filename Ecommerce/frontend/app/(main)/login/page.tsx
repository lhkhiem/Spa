'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Disable static generation for this page (uses useSearchParams)
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import { useAuthStore } from '@/lib/stores/authStore';
import { login } from '@/lib/api/auth';
import { LoginCredentials } from '@/lib/types/user';
import toast from 'react-hot-toast';

type LoginFormData = LoginCredentials;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to account if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect') || '/account';
      router.push(redirect);
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await login(data);

      setAuth(
        response.user,
        response.accessToken,
        response.refreshToken
      );

      toast.success('Đăng nhập thành công!');
      
      // Redirect to intended page or account
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect') || '/account';
      router.push(redirect);
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
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

          {/* Login Card */}
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Đăng nhập</h1>
            <p className="mb-8 text-gray-600">
              Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <Input
                label="Email"
                type="email"
                placeholder="your.email@example.com"
                leftIcon={<FiMail className="h-5 w-5" />}
                error={errors.email?.message}
                required
                {...register('email', {
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ',
                  },
                })}
              />

              {/* Password */}
              <div>
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
                  required
                  {...register('password', {
                    required: 'Mật khẩu là bắt buộc',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự',
                    },
                  })}
                />
                <div className="mt-2 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-brand-purple-600 hover:text-brand-purple-700"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Đăng nhập
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">hoặc</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-brand-purple-600 hover:text-brand-purple-700"
                >
                  Đăng ký ngay
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


