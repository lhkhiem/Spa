'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import Button from '@/components/ui/Button/Button';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import ParallaxSection from '@/components/ui/ParallaxSection/ParallaxSection';
import { FiMail, FiPhone, FiMapPin, FiClock, FiCheckCircle } from 'react-icons/fi';
import { submitContactForm } from '@/lib/api/contacts';
import { handleApiError } from '@/lib/api/client';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Liên hệ', href: '/contact' },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await submitContactForm({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || '', // email không bắt buộc
        phone: formData.phone, // số điện thoại bắt buộc
        subject: formData.subject,
        message: formData.message,
      });

      if (response.success) {
        setIsSubmitted(true);
        toast.success(response.message || 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });

        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        toast.error(response.error || 'Gửi tin nhắn thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax */}
      <ParallaxSection
        backgroundImage="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1920&q=80"
        overlay={true}
        overlayColor="bg-black"
        overlayOpacity="bg-opacity-60"
      >
        <div className="text-center text-white">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl drop-shadow-lg">
              Liên hệ
            </h1>
            <p className="max-w-2xl mx-auto text-lg drop-shadow-md">
              Chúng tôi luôn sẵn sàng hỗ trợ! Liên hệ để được tư vấn sản phẩm, hỗ trợ đơn hàng hoặc hợp tác kinh doanh.
            </p>
          </FadeInSection>
        </div>
      </ParallaxSection>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
          {/* Contact Form */}
            <div className="flex-1 lg:flex-[2]">
            <FadeInSection>
              <div className="rounded-2xl bg-white p-8 shadow-lg h-full">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Gửi tin nhắn cho chúng tôi</h2>
                
                {isSubmitted && (
                  <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3">
                    <FiCheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Gửi tin nhắn thành công!</p>
                      <p className="text-sm text-green-700 mt-1">
                        Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-gray-700">
                        Tên *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="Ví dụ: An"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-gray-700">
                        Họ *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder="Ví dụ: Nguyễn"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="email@domain.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                      Số điện thoại *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="Ví dụ: 0901 234 567"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                      Cần hỗ trợ *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="input w-full"
                      disabled={isSubmitting}
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="product">Tư vấn sản phẩm</option>
                      <option value="order">Tình trạng đơn hàng</option>
                      <option value="support">Hỗ trợ kỹ thuật</option>
                      <option value="spa-development">Dịch vụ phát triển Spa</option>
                      <option value="partnership">Cơ hội hợp tác</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                      Nội dung *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4} // thu ngắn để cân chiều cao
                      value={formData.message}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="Bạn cần hỗ trợ gì?"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                  </Button>
                </form>
              </div>
            </FadeInSection>
          </div>

          {/* Contact Information + Map */}
          <div className="flex-1 flex flex-col gap-6">
            <FadeInSection delay={100}>
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                      <FiPhone className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Điện thoại</p>
                      <p className="text-gray-600">1-800-123-4567</p>
                      <p className="text-sm text-gray-500">Thứ 2-6, 9:00-18:00 EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                      <FiMail className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-gray-600">support@universalcompanies.com</p>
                      <p className="text-sm text-gray-500">Phản hồi trong 24 giờ</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                      <FiMapPin className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Địa chỉ</p>
                      <p className="text-gray-600">
                        123 Spa Boulevard
                        <br />
                        Suite 100
                        <br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                      <FiClock className="h-5 w-5 text-red-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Giờ làm việc</p>
                      <p className="text-gray-600">
                        Thứ 2 - Thứ 6: 9:00 - 18:00 EST
                        <br />
                        Thứ 7: 10:00 - 16:00 EST
                        <br />
                        Chủ nhật: Nghỉ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={200} className="flex-1">
              <div className="rounded-2xl bg-white shadow-lg overflow-hidden h-full">
                <iframe
                  title="Vị trí trên Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24156.741970260586!2d-74.0059415!3d40.7127837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zTmfDtSB5w7RuZyBOWXJr!5e0!3m2!1svi!2s!4v1699999999999"
                  loading="lazy"
                  allowFullScreen
                  className="w-full h-full border-0"
                ></iframe>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </div>
  );
}
