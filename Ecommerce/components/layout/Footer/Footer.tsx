import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Customer Support */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Hỗ Trợ Khách Hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-white">
                  Liên Hệ Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white">
                  Vận Chuyển & Đổi Trả
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-white">
                  Câu Hỏi Thường Gặp
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Chương Trình Thưởng
                </Link>
              </li>
            </ul>
          </div>

          {/* Spa Business Resources */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Tài Nguyên Kinh Doanh Spa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-white">
                  Học Tập
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Phát Triển Spa
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Đối Tác Trường Học
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Thông Tin Công Ty</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Tuyển Dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Shopping & Offers */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Mua Sắm & Ưu Đãi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories" className="hover:text-white">
                  Xem Catalog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Cửa Hàng Giảm Giá
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Tài Chính
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Company Info - Two Column Layout */}
        <div className="mt-8 border-t border-gray-800 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Company Info + Contact Buttons */}
            <div>
              <div className="text-sm text-gray-400 mb-4">
                <p className="text-lg font-semibold text-white mb-2">Công Ty Cổ Phần Banyco</p>
                <p>2700971219</p>
                <p className="mt-2">Tầng 5, Toà nhà Thể thao Mai Thế Hệ, số 142, đường Nam Thành,</p>
                <p>Phường Hoa Lư, Tỉnh Ninh Bình, Việt Nam</p>
              </div>
              
              {/* Contact Buttons - Full Width, Same Size */}
              <div className="flex flex-col space-y-3">
                <a 
                  href="tel:0986671529"
                  className="flex items-center justify-center px-6 py-3 rounded-full bg-[#98131b] text-white font-medium hover:bg-[#7a0f16] transition-colors w-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Hotline: 0986 671 5229
                </a>
                <a 
                  href="mailto:sales@banyco.net"
                  className="flex items-center justify-center px-6 py-3 rounded-full bg-[#98131b] text-white font-medium hover:bg-[#7a0f16] transition-colors w-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  sales@banyco.net
                </a>
              </div>
            </div>

            {/* Right Column - Newsletter Form + Social Icons */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-white">
                Đăng Ký Nhận Bản Tin Miễn Phí!
              </h3>
              <div className="flex flex-col sm:flex-row mb-4">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 rounded-t-md sm:rounded-l-md sm:rounded-tr-none border-0 px-4 py-3 text-gray-900"
                />
                <button className="rounded-b-md sm:rounded-r-md sm:rounded-bl-none bg-brand-purple-600 px-6 py-3 text-white hover:bg-brand-purple-700">
                  Đăng Ký
                </button>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <FiFacebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FiInstagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FiTwitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FiYoutube className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FiLinkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Text */}
          <div className="mt-6 text-center text-sm text-gray-400 border-t border-gray-800 pt-4">
            <p>© 2025 Banyco - Bảo lưu mọi quyền</p>
            <div className="mt-2 space-x-4">
              <Link href="/privacy" className="hover:text-white">
                Chính Sách Bảo Mật
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-white">
                Điều Khoản Dịch Vụ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
