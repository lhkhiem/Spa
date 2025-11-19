'use client';

import { useState, FormEvent } from 'react';
import { vietnamProvinces } from '@/lib/data/provinces';

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    province: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement API call to backend
    console.log('Form data:', formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      province: '',
      message: '',
    });
    
    setIsSubmitting(false);
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
  };

  return (
    <section className="relative w-full py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&h=1080&fit=crop)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 lg:p-10 border border-white/20">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-8">
            Tư vấn setup thiết bị ngành spa
          </h2>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tên */}
              <div>
                <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                  Tên <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm text-black rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#98131b] focus:border-transparent transition-all"
                  placeholder="Nhập tên của bạn"
                />
              </div>

              {/* Điện thoại */}
              <div>
                <label htmlFor="phone" className="block text-white text-sm font-medium mb-2">
                  Điện thoại <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm text-black rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#98131b] focus:border-transparent transition-all"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm text-black rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#98131b] focus:border-transparent transition-all"
                  placeholder="Nhập email của bạn"
                />
              </div>

              {/* Khu vực */}
              <div>
                <label htmlFor="province" className="block text-white text-sm font-medium mb-2">
                  Khu vực <span className="text-red-400">*</span>
                </label>
                <select
                  id="province"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm text-black rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#98131b] focus:border-transparent transition-all"
                  style={{ color: formData.province ? 'black' : '#9ca3af' }}
                >
                  <option value="">Chọn tỉnh thành</option>
                  {vietnamProvinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lời nhắn */}
            <div>
              <label htmlFor="message" className="block text-white text-sm font-medium mb-2">
                Lời nhắn
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm text-black rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#98131b] focus:border-transparent transition-all resize-none"
                placeholder="Để lại lời nhắn của bạn..."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#98131b] hover:bg-[#7a0f16] text-white font-semibold rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
