import Breadcrumb from '@/components/ui/Breadcrumb/Breadcrumb';
import FadeInSection from '@/components/ui/FadeInSection/FadeInSection';
import ParallaxSection from '@/components/ui/ParallaxSection/ParallaxSection';
import { FiChevronDown } from 'react-icons/fi';

const faqCategories = [
  {
    id: 'orders',
    title: 'Đơn hàng & Vận chuyển',
    faqs: [
      {
        question: 'Thời gian giao hàng mất bao lâu?',
        answer: 'Đơn hàng tiêu chuẩn thường mất 3–7 ngày làm việc (không tính Chủ Nhật và ngày lễ). Các thiết bị cồng kềnh hoặc đặt theo yêu cầu có thể cần thêm 2–5 ngày xử lý để kiểm tra chất lượng, đóng gói an toàn chống sốc, và sắp xếp lịch giao. Miễn phí vận chuyển cho đơn từ $749; đơn từ $199 chỉ $4.99. Nếu bạn cần gấp để kịp khai trương hoặc buổi trị liệu đặc biệt, chúng tôi cung cấp gói nhanh (2 ngày / qua đêm) – hãy liên hệ trước để được tư vấn tuyến vận chuyển tối ưu, bảo đảm thiết bị vẫn an toàn.',
      },
      {
        question: 'Làm sao để theo dõi tình trạng đơn hàng?',
        answer: 'Sau khi đơn được xuất kho bạn sẽ nhận email chứa mã tracking. Đồng thời trong tài khoản của bạn phần Lịch sử đơn hàng hiển thị: trạng thái xử lý (Chuẩn bị – Đóng gói – Xuất kho – Đang giao – Hoàn tất), số kiện hàng, thiết bị tách kiện (nếu bàn điều trị hoặc ghế thủy lực được đóng riêng), và ghi chú kiểm định (QC pass). Với đơn thiết bị lớn, chúng tôi bổ sung ảnh pallet trước khi bọc để bạn yên tâm.',
      },
      {
        question: 'Tôi có thể sửa hoặc hủy đơn sau khi đặt không?',
        answer: 'Bạn có thể chỉnh sửa / hủy trong vòng 2 giờ kể từ khi đặt (đổi model, màu, điện áp 110V/220V nếu có tùy chọn). Sau mốc đó, kho có thể đã bắt đầu đóng gói: hãy gọi hotline 0986 671 5229 (ưu tiên) hoặc gửi email support@banyco.net – chúng tôi sẽ cố gắng can thiệp nếu chưa bốc xếp lên xe tải. Với thiết bị đặt riêng (custom upholstery, logo in nhiệt) không thể hủy sau khi đã chuyển vào khâu sản xuất.',
      },
      {
        question: 'Có giao hàng quốc tế không?',
        answer: 'Có. Chúng tôi gửi đến nhiều quốc gia trong khu vực với điều kiện thiết bị đáp ứng tiêu chuẩn điện áp và chứng từ nhập khẩu. Phí và thời gian phụ thuộc địa chỉ, loại thiết bị (có động cơ / nhiệt / hóa chất), yêu cầu kiểm định. Liên hệ trước để nhận báo giá trọn gói (FOB / Door-to-door) và tư vấn đóng gói gỗ nếu cần vận chuyển đường biển.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Đổi trả & Bảo hành',
    faqs: [
      {
        question: 'Chính sách đổi trả như thế nào?',
        answer: 'Hầu hết sản phẩm được đổi trả trong 30 ngày nếu chưa sử dụng, nguyên tem – hộp – niêm phong. Thiết bị điện đã mở nguồn, hóa chất đã khui, hoặc đồ tiêu hao (wax, khăn, găng) không áp dụng đổi trả trừ lỗi sản xuất. Mỗi yêu cầu cần số RA (Return Authorization) để kho tiếp nhận đúng quy trình kiểm định.',
      },
      {
        question: 'Quy trình tạo yêu cầu đổi trả?',
        answer: 'Gửi email returns@banyco.net kèm: số đơn, ảnh tình trạng, lý do. Chúng tôi phản hồi trong 24h với số RA và hướng dẫn đóng gói. Thiết bị có linh kiện thủy lực/điện cần chèn xốp lại để tránh hư trong chặng về. Một số trường hợp được cấp nhãn hoàn trả trả trước (prepaid label) nếu lỗi thuộc nhà cung cấp.',
      },
      {
        question: 'Bao lâu tôi nhận được tiền hoàn?',
        answer: 'Sau khi kho kiểm tra đạt điều kiện (thường trong 3 ngày làm việc kể từ khi nhận), bộ phận kế toán xử lý hoàn tiền về phương thức thanh toán ban đầu trong 5–7 ngày. Với giao dịch qua cổng tài chính trả góp, khoản hoàn có thể phản ánh muộn tùy kỳ sao kê của đối tác.',
      },
      {
        question: 'Tôi có thể đổi sang sản phẩm khác không?',
        answer: 'Có. Khi yêu cầu RA hãy ghi rõ model muốn đổi. Nếu giá chênh lệch chúng tôi gửi hóa đơn điều chỉnh. Thiết bị thay thế chỉ xuất kho sau khi nhận và kiểm định xong hàng trả về để bảo đảm tránh phát sinh tồn lỗi.',
      },
    ],
  },
  {
    id: 'products',
    title: 'Sản phẩm & Giá',
    faqs: [
      {
        question: 'Sản phẩm có đạt chuẩn chuyên nghiệp (professional-grade) không?',
        answer: 'Toàn bộ sản phẩm được lựa chọn cho môi trường spa/salon chuyên nghiệp: vật liệu chịu tải cao, động cơ kiểm định an toàn nhiệt & điện, bề mặt da/vinyl kháng dung dịch vệ sinh. Chúng tôi chỉ hợp tác thương hiệu đã qua quy trình thẩm định: chứng chỉ, lịch sử bảo hành, độ ổn định chuỗi cung ứng. Trước khi niêm yết, mẫu test nội bộ vận hành tối thiểu 72 giờ liên tục để đo nhiệt độ, tiếng ồn, độ rung.',
      },
      {
        question: 'Có chương trình giảm giá khi mua số lượng lớn không?',
        answer: 'Có. Các mốc chiết khấu thường áp dụng theo giá trị đơn hoặc số lượng (ví dụ: ≥10 máy hấp khăn, ≥5 giường điện). Ngoài giảm trực tiếp còn có gói tặng kèm vật tư tiêu hao tháng đầu. Trên trang sản phẩm sẽ hiển thị nhãn “Mua sỉ & Tiết kiệm” hoặc bạn liên hệ để nhận báo giá tổ hợp nhiều dòng thiết bị cùng lúc.',
      },
      {
        question: 'Làm sao chọn đúng thiết bị cho spa của tôi?',
        answer: 'Chuyên viên tư vấn sẽ dựa trên dịch vụ bạn cung cấp (facial, waxing, massage trị liệu, y học tái tạo), diện tích phòng, lưu lượng khách, ngân sách, lộ trình mở rộng 6–12 tháng để đề xuất danh mục thiết bị. Chúng tôi có bảng so sánh kỹ thuật (công suất, độ ồn, mức tiêu thụ điện) và khuyến nghị phối hợp màu sắc nội thất. Gửi sơ đồ mặt bằng hoặc ảnh hiện trạng để nhận bản đề xuất chi tiết miễn phí.',
      },
      {
        question: 'Sản phẩm có thân thiện thuần chay / không thử nghiệm động vật?',
        answer: 'Nhiều dòng mỹ phẩm – skincare chúng tôi phân phối có chứng nhận Cruelty-Free, Vegan, hoặc Organic. Tìm biểu tượng chứng nhận trên trang chi tiết hoặc dùng bộ lọc “Không thử nghiệm trên động vật”. Nếu cần bộ danh sách đầy đủ theo tiêu chuẩn cụ thể (Ecocert, Leaping Bunny) hãy yêu cầu qua email – chúng tôi sẽ gửi file cập nhật mới nhất.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Tài khoản & Thanh toán',
    faqs: [
      {
        question: 'Có bắt buộc tạo tài khoản khi mua hàng?',
        answer: 'Không, bạn có thể mua nhanh dạng khách (guest checkout). Tuy nhiên tạo tài khoản giúp: theo dõi tiến trình đơn, lưu danh sách yêu thích, nhận ưu đãi định kỳ và tích điểm thưởng (Good Karma Rewards) quy đổi vật tư hoặc giảm giá đơn sau.',
      },
      {
        question: 'Chấp nhận những phương thức thanh toán nào?',
        answer: 'Chúng tôi nhận thẻ tín dụng/ghi nợ phổ biến (Visa, MasterCard, AmEx, Discover), PayPal, chuyển khoản doanh nghiệp và gói tài chính trả góp qua đối tác. Các thiết bị giá trị cao có thể yêu cầu đặt cọc để khóa lịch sản xuất.',
      },
      {
        question: 'Thông tin thanh toán có an toàn không?',
        answer: 'Hệ thống mã hóa SSL chuẩn ngành, tuân thủ PCI-DSS. Không lưu trữ toàn bộ số thẻ trên máy chủ – chỉ token hóa để xử lý phiên giao dịch. Bất kỳ nghi ngờ rò rỉ bạn có thể yêu cầu hủy token và cập nhật thẻ mới ngay lập tức.',
      },
      {
        question: 'Có hỗ trợ tài chính / trả góp?',
        answer: 'Có. Các gói linh hoạt 3–12 tháng, lãi suất ưu đãi cho thiết bị nền tảng (giường điện, máy soi da kỹ thuật số). Gửi thông tin doanh nghiệp cơ bản để chúng tôi xét duyệt sơ bộ trong 24 giờ. Chúng tôi cũng hỗ trợ bảng phân bổ dòng tiền để bạn hoạch định lợi nhuận sau khi nâng cấp dịch vụ.',
      },
    ],
  },
  {
    id: 'services',
    title: 'Phát triển & Dịch vụ Spa',
    faqs: [
      {
        question: 'Bạn cung cấp những dịch vụ phát triển spa nào?',
        answer: 'Chúng tôi cung cấp trọn gói: tư vấn concept & định vị thương hiệu; thiết kế sơ đồ phòng trị liệu tối ưu luồng di chuyển; xây dựng menu dịch vụ & combo bán thêm; đề xuất thiết bị chi tiết kèm công suất và tiêu chuẩn điện; hướng dẫn quy trình bảo trì; đào tạo nhân sự (kỹ thuật vận hành, vệ sinh an toàn). Sau khai trương vẫn có gói hỗ trợ định kỳ tối ưu hóa lãi gộp mỗi dịch vụ.',
      },
      {
        question: 'Chi phí triển khai phát triển spa?',
        answer: 'Chi phí phụ thuộc diện tích, số phòng chức năng, danh mục dịch vụ, mức độ tùy biến nội thất. Chúng tôi luôn bắt đầu bằng buổi tư vấn miễn phí (30–45 phút) để xác định phạm vi rồi gửi báo giá phân tách hạng mục (thiết kế, thiết bị, đào tạo, bảo trì). Mô hình nhỏ có thể dùng gói tiêu chuẩn tiết kiệm ~20% so với tùy biến toàn bộ.',
      },
      {
        question: 'Có đào tạo sử dụng thiết bị & sản phẩm mới không?',
        answer: 'Có: video hướng dẫn chuẩn hóa, tài liệu PDF quy trình vệ sinh – khử khuẩn, buổi đào tạo trực tuyến và tại chỗ đối với thiết bị phức tạp (laser nhẹ, máy xông đa chức năng). Nhiều thương hiệu đối tác cung cấp chứng chỉ – chúng tôi hỗ trợ đăng ký và theo dõi tiến độ hoàn tất của nhân viên.',
      },
      {
        question: 'Hỗ trợ lắp đặt thiết bị như thế nào?',
        answer: 'Đối với thiết bị trọng điểm: kiểm tra kích thước cửa và lối đi trước khi giao; bố trí lịch kỹ thuật viên đi cùng; test điện áp, độ ổn định khung, hiệu chuẩn nhiệt/áp suất ban đầu; bàn giao biên bản nghiệm thu kèm check-list bảo trì 30/90 ngày. Bạn chỉ cần chuẩn bị nguồn điện và không gian trống đúng khuyến nghị.',
      },
    ],
  },
];

export default function FAQsPage() {
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Hỏi đáp', href: '/faqs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax */}
      <ParallaxSection
        backgroundImage="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=80"
        overlay={true}
        overlayColor="bg-black"
        overlayOpacity="bg-opacity-60"
      >
        <div className="text-center text-white">
          <FadeInSection>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl drop-shadow-lg">
              Hỏi đáp thường gặp
            </h1>
            <p className="max-w-2xl mx-auto text-lg drop-shadow-md">
              Tổng hợp giải đáp chi tiết về đơn hàng, vận chuyển, bảo hành – đổi trả, lựa chọn thiết bị, tư vấn xây dựng & vận hành spa chuyên nghiệp.
            </p>
          </FadeInSection>
        </div>
      </ParallaxSection>

      <div className="container-custom py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-12" />

        {/* Quick Links */}
        <FadeInSection>
          <div className="mb-12 rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Danh mục nhanh</h2>
            <div className="flex flex-wrap gap-3">
              {faqCategories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-[#98131b] transition-all hover:bg-[#98131b] hover:text-white"
                >
                  {category.title}
                </a>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <FadeInSection key={category.id} delay={categoryIndex * 100}>
              <div id={category.id}>
                <h2 className="mb-6 text-3xl font-bold text-gray-900">{category.title}</h2>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <details
                      key={faqIndex}
                      className="group rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg"
                    >
                      <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-900">
                        <span>{faq.question}</span>
                        <FiChevronDown className="h-5 w-5 text-red-600 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="mt-4 text-gray-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>

        {/* Contact CTA */}
        <FadeInSection>
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-500 p-8 text-center text-white md:p-12">
            <h2 className="mb-4 text-3xl font-bold">Vẫn còn thắc mắc?</h2>
            <p className="mb-6 text-lg text-red-50">
              Đội ngũ hỗ trợ & tư vấn thiết bị của chúng tôi sẵn sàng đồng hành. Liên hệ ngay để nhận giải pháp phù hợp nhất cho spa của bạn.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="rounded-lg bg-white px-8 py-3 font-semibold text-red-700 transition-all hover:bg-red-50"
              >
                Liên hệ hỗ trợ
              </a>
              <a
                href="tel:1-800-123-4567"
                className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-red-700"
              >
                Gọi hotline: 0986 671 5229
              </a>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
