import { Metadata } from 'next';
import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import { FiTruck, FiPackage, FiRotateCcw, FiClock } from 'react-icons/fi';
import { getPageMetadataFromCMS, generatePageMetadata } from '@/lib/utils/pageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageMetadataFromCMS('/shipping');
  
  return generatePageMetadata(data, '/shipping', {
    title: 'Chính sách Vận chuyển & Đổi trả - Banyco',
    description: 'Miễn phí vận chuyển cho đơn hàng trên 749.000₫+, vận chuyển giá rẻ 4.990₫ cho đơn hàng trên 199.000₫+. Chính sách đổi trả 30 ngày dễ dàng.',
    ogImage: '/images/og-shipping.jpg',
  });
}

export default function ShippingPage() {
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Vận chuyển & Đổi trả', href: '/shipping' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative py-16 text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1920&q=80)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0" />
        
        <div className="container-custom relative z-10">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Chính sách Vận chuyển & Đổi trả</h1>
            <p className="max-w-2xl text-lg text-gray-100">
              Vận chuyển nhanh chóng, đáng tin cậy và đổi trả dễ dàng. Chúng tôi giúp bạn dễ dàng có được những sản phẩm bạn cần.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        {/* Shipping Benefits */}
        <div className="mb-12 grid gap-6 md:grid-cols-4">
          <FadeInSection>
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <FiTruck className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">Miễn phí vận chuyển</h3>
              <p className="text-sm text-gray-600">Cho đơn hàng từ 749.000₫+</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={100}>
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <FiPackage className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">Vận chuyển giá rẻ</h3>
              <p className="text-sm text-gray-600">4.990₫ cho đơn hàng từ 199.000₫+</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={200}>
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <FiClock className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">Xử lý nhanh</h3>
              <p className="text-sm text-gray-600">Giao hàng trong 1-2 ngày làm việc</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={300}>
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <FiRotateCcw className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="mb-2 font-bold text-gray-900">Đổi trả dễ dàng</h3>
              <p className="text-sm text-gray-600">Chính sách đổi trả 30 ngày</p>
            </div>
          </FadeInSection>
        </div>

        {/* Shipping Information */}
        <div className="mb-12">
          <FadeInSection>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Thông tin Vận chuyển</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    Phí vận chuyển & Thời gian giao hàng
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Tổng đơn hàng
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Phí vận chuyển
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Thời gian giao hàng
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-900">0₫ - 198.990₫</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            Tính tại trang thanh toán
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">3-7 ngày làm việc</td>
                        </tr>
                        <tr className="bg-blue-50">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            199.000₫ - 748.990₫
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                            4.990₫
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">3-7 ngày làm việc</td>
                        </tr>
                        <tr className="bg-green-50">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            749.000₫ trở lên
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-green-600">
                            MIỄN PHÍ VẬN CHUYỂN
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">3-7 ngày làm việc</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    Tùy chọn Vận chuyển Nhanh
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                      <span>
                        <strong className="text-gray-900">Giao hàng nhanh 2 ngày:</strong> Có sẵn với
                        phí bổ sung 699.000₫
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                      <span>
                        <strong className="text-gray-900">Giao hàng qua đêm:</strong> Có sẵn với
                        phí bổ sung 1.199.000₫
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                      <span>
                        Chọn phương thức vận chuyển ưa thích của bạn trong quá trình thanh toán. Các tùy chọn giao hàng nhanh
                        phải được đặt trước 12 giờ trưa (giờ Việt Nam) để xử lý trong ngày.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    Vận chuyển Quốc tế
                  </h3>
                  <p className="mb-3 text-gray-600">
                    Chúng tôi vận chuyển đến một số điểm đến quốc tế được chọn. Phí vận chuyển quốc tế và
                    thời gian giao hàng thay đổi theo địa điểm.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                      <span>Phí hải quan và thuế nhập khẩu là trách nhiệm của khách hàng</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                      <span>Thời gian giao hàng: 7-21 ngày làm việc tùy thuộc vào điểm đến</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                      <span>Liên hệ chúng tôi để nhận báo giá vận chuyển trước khi đặt hàng quốc tế</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>

        {/* Return Policy */}
        <div>
          <FadeInSection>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Chính sách Đổi trả</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">Bảo đảm Đổi trả 30 Ngày</h3>
                  <p className="text-gray-600">
                    Chúng tôi muốn bạn hoàn toàn hài lòng với việc mua hàng của mình. Nếu bạn không hài lòng
                    vì bất kỳ lý do nào, bạn có thể trả lại hầu hết các mặt hàng trong vòng 30 ngày kể từ ngày giao hàng để được
                    hoàn tiền đầy đủ hoặc đổi hàng.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">Yêu cầu Đổi trả</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                      <span>Sản phẩm phải chưa sử dụng, chưa mở và còn nguyên bao bì gốc</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                      <span>Yêu cầu đổi trả phải được thực hiện trong vòng 30 ngày kể từ ngày giao hàng</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                      <span>Bao gồm tất cả bao bì gốc, hướng dẫn sử dụng và phụ kiện</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
                      <span>Số Ủy quyền Đổi trả (RA) là bắt buộc cho tất cả các yêu cầu đổi trả</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">Sản phẩm Không thể Đổi trả</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-600" />
                      <span>Sản phẩm chăm sóc cá nhân và mỹ phẩm đã mở (vì lý do vệ sinh)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-600" />
                      <span>Sản phẩm tùy chỉnh hoặc cá nhân hóa</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-600" />
                      <span>Sản phẩm bán cuối hoặc xả kho (được đánh dấu như vậy)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-600" />
                      <span>Thẻ quà tặng và e-certificate</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">Cách Thực hiện Đổi trả</h3>
                  <ol className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        1
                      </span>
                      <span>
                        <strong className="text-gray-900">Liên hệ Chúng tôi:</strong> Gọi 0986 671 5229
                        hoặc email sales@banyco.net để yêu cầu số Ủy quyền Đổi trả
                        (RA)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        2
                      </span>
                      <span>
                        <strong className="text-gray-900">Đóng gói Sản phẩm:</strong> Đóng gói an toàn
                        các sản phẩm trong bao bì gốc cùng với tất cả phụ kiện
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        3
                      </span>
                      <span>
                        <strong className="text-gray-900">Gửi Đổi trả:</strong> Sử dụng nhãn đổi trả trả trước
                        chúng tôi cung cấp hoặc gửi bằng chi phí của bạn đến địa chỉ được cung cấp
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        4
                      </span>
                      <span>
                        <strong className="text-gray-900">Nhận Hoàn tiền:</strong> Sau khi chúng tôi
                        nhận và kiểm tra đổi trả của bạn, chúng tôi sẽ xử lý hoàn tiền trong vòng 5-7
                        ngày làm việc
                      </span>
                    </li>
                  </ol>
                </div>

                <div className="rounded-lg bg-blue-50 p-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Có câu hỏi về đổi trả?
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Đội ngũ hỗ trợ khách hàng của chúng tôi sẵn sàng giúp bạn thực hiện đổi trả dễ dàng nhất có thể.
                  </p>
                  <a
                    href="/contact"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Liên hệ Hỗ trợ →
                  </a>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
}
