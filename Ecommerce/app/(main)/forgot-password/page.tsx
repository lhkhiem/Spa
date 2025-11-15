'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import { forgotPassword } from '@/lib/api/auth';
import toast from 'react-hot-toast';

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await forgotPassword(data.email);
      setIsSubmitted(true);
      toast.success('Email đặt lại mật khẩu đã được gửi!');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-[120px] pb-16">
        <div className="container-custom">
          <div className="mx-auto max-w-md">
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

            <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <FiCheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                Email đã được gửi!
              </h1>
              <p className="mb-8 text-gray-600">
                Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
              </p>
              <div className="space-y-4">
                <Button href="/login" size="lg" fullWidth>
                  Quay lại đăng nhập
                </Button>
                <Link
                  href="/"
                  className="block text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Quay lại trang chủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Forgot Password Card */}
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Quên mật khẩu</h1>
            <p className="mb-8 text-gray-600">
              Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
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

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Gửi link đặt lại mật khẩu
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-brand-purple-600 hover:text-brand-purple-700"
              >
                ← Quay lại đăng nhập
              </Link>
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


