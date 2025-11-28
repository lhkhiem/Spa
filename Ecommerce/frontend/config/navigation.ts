// Navigation structure
export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  featured?: boolean;
  image?: string;
  description?: string;
}

export const mainNavigation: NavItem[] = [
  {
    label: 'Mua theo danh mục',
    children: [
      {
        label: 'Chăm sóc da',
        href: '/categories/skin-care',
        featured: true,
        description: 'Sản phẩm và liệu trình chăm sóc da chuyên nghiệp',
      },
      {
        label: 'Mi & Chân mày',
        href: '/categories/lash-brow',
        description: 'Nối mi, nhuộm và sản phẩm cho chân mày',
      },
      {
        label: 'Massage',
        href: '/categories/massage',
        description: 'Dầu massage, dụng cụ và thiết bị',
      },
      {
        label: 'Wax',
        href: '/categories/waxing',
        description: 'Sản phẩm và vật tư wax',
      },
      {
        label: 'Móng tay/Móng chân',
        href: '/categories/manicure-pedicure',
        description: 'Sản phẩm và thiết bị chăm sóc móng',
      },
      {
        label: 'Trang điểm',
        href: '/categories/makeup',
        description: 'Sản phẩm trang điểm chuyên nghiệp',
      },
      {
        label: 'Tóc',
        href: '/categories/hair',
        description: 'Sản phẩm chăm sóc và tạo kiểu tóc',
      },
      {
        label: 'Thiết bị spa',
        href: '/categories/spa-equipment',
        description: 'Giường trị liệu, ghế và thiết bị',
      },
    ],
  },
  {
    label: 'Sản phẩm',
    href: '/products',
  },
  {
    label: 'Thiết bị',
    href: '/equipment',
  },
  {
    label: 'Thương hiệu',
    href: '/brands',
  },
  {
    label: 'Ưu đãi!',
    href: '/deals',
  },
];

export const footerNavigation = {
  customerSupport: [
    { label: 'Liên hệ', href: '/contact' },
    { label: 'Chính sách vận chuyển & đổi trả', href: '/shipping-returns' },
    { label: 'Câu hỏi thường gặp', href: '/faqs' },
    { label: 'Chương trình Good Karma', href: '/rewards' },
  ],
  spaBusinessResources: [
    { label: 'Học tập', href: '/learning' },
    { label: 'Phát triển spa', href: '/spa-development' },
    { label: 'Đối tác trường học', href: '/school-partnerships' },
  ],
  companyInformation: [
    { label: 'Về chúng tôi', href: '/about' },
    { label: 'Tuyển dụng', href: '/careers' },
  ],
  shoppingAndOffers: [
    { label: 'Xem catalog', href: '/catalogs' },
    { label: 'UCo Outlet', href: '/outlet' },
    { label: 'Tài chính', href: '/financing' },
  ],
};
