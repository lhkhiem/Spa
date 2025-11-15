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
    label: 'Shop Categories',
    children: [
      {
        label: 'Skin Care',
        href: '/categories/skin-care',
        featured: true,
        description: 'Professional skincare products and treatments',
      },
      {
        label: 'Lash & Brow',
        href: '/categories/lash-brow',
        description: 'Lash extensions, tints, and brow products',
      },
      {
        label: 'Massage',
        href: '/categories/massage',
        description: 'Massage oils, tools, and equipment',
      },
      {
        label: 'Waxing',
        href: '/categories/waxing',
        description: 'Waxing products and supplies',
      },
      {
        label: 'Manicure/Pedicure',
        href: '/categories/manicure-pedicure',
        description: 'Nail care products and equipment',
      },
      {
        label: 'Makeup',
        href: '/categories/makeup',
        description: 'Professional makeup products',
      },
      {
        label: 'Hair',
        href: '/categories/hair',
        description: 'Hair care and styling products',
      },
      {
        label: 'Spa Equipment',
        href: '/categories/spa-equipment',
        description: 'Treatment tables, chairs, and equipment',
      },
    ],
  },
  {
    label: 'Products',
    href: '/products',
  },
  {
    label: 'Equipment',
    href: '/equipment',
  },
  {
    label: 'Brands',
    href: '/brands',
  },
  {
    label: 'Save Now!',
    href: '/deals',
  },
];

export const footerNavigation = {
  customerSupport: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping & Return Policies', href: '/shipping-returns' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Good Karma Rewards', href: '/rewards' },
  ],
  spaBusinessResources: [
    { label: 'Learning', href: '/learning' },
    { label: 'Spa Development', href: '/spa-development' },
    { label: 'School Partnerships', href: '/school-partnerships' },
  ],
  companyInformation: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
  ],
  shoppingAndOffers: [
    { label: 'Browse Catalogs', href: '/catalogs' },
    { label: 'UCo Outlet', href: '/outlet' },
    { label: 'Financing', href: '/financing' },
  ],
};
