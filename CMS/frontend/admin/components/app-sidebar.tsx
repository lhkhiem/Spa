'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppearance } from '@/hooks/use-appearance';
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Settings,
  BarChart3,
  Folder,
  Tags,
  ChevronRight,
  Package,
  Grid3x3,
  Tag,
  PackageOpen,
  Menu,
  // ShoppingCart, // Disabled: Customer cart management not needed
  Receipt, // Orders for admin management
  // Heart, // Disabled: Customer wishlist management not needed
  // Star, // Disabled: Customer review management not needed
  Code,
  Sparkles,
  MessageSquareQuote,
  Mail,
  PhoneCall,
} from 'lucide-react';

const navigation = [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        title: 'Posts',
        href: '/dashboard/posts',
        icon: FileText,
      },
      {
        title: 'Topics',
        href: '/dashboard/topics',
        icon: Folder,
      },
      {
        title: 'Tags',
        href: '/dashboard/tags',
        icon: Tags,
      },
    ],
  },
  {
    title: 'Products',
    items: [
      {
        title: 'All Products',
        href: '/dashboard/products',
        icon: Package,
      },
      {
        title: 'Categories',
        href: '/dashboard/products/categories',
        icon: Grid3x3,
      },
      {
        title: 'Brands',
        href: '/dashboard/products/brands',
        icon: Tag,
      },
      {
        title: 'Inventory',
        href: '/dashboard/products/inventory',
        icon: PackageOpen,
      },
    ],
  },
  // E-Commerce section - Only Orders (admin management, not customer management)
  {
    title: 'E-Commerce',
    items: [
      {
        title: 'Orders',
        href: '/dashboard/orders',
        icon: Receipt,
      },
      {
        title: 'Contact Messages',
        href: '/dashboard/contacts',
        icon: Mail,
      },
      {
        title: 'Consultations',
        href: '/dashboard/consultations',
        icon: PhoneCall,
      },
      // Disabled: Customer management features not needed
      // {
      //   title: 'Shopping Cart',
      //   href: '/dashboard/cart',
      //   icon: ShoppingCart,
      // },
      // {
      //   title: 'Wishlists',
      //   href: '/dashboard/wishlist',
      //   icon: Heart,
      // },
      // {
      //   title: 'Reviews',
      //   href: '/dashboard/reviews',
      //   icon: Star,
      // },
    ],
  },
  {
    title: 'Media',
    items: [
      {
        title: 'Media Library',
        href: '/dashboard/media',
        icon: Image,
      },
    ],
  },
  {
    title: 'Appearance',
    items: [
      {
        title: 'Sliders',
        href: '/dashboard/sliders',
        icon: Image,
      },
      {
        title: 'Value Props',
        href: '/dashboard/value-props',
        icon: Sparkles,
      },
      {
        title: 'Testimonials',
        href: '/dashboard/testimonials',
        icon: MessageSquareQuote,
      },
      {
        title: 'Menus',
        href: '/dashboard/menus',
        icon: Menu,
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        title: 'Users & Roles',
        href: '/dashboard/users',
        icon: Users,
      },
      {
        title: 'Tracking Scripts',
        href: '/dashboard/tracking-scripts',
        icon: Code,
      },
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { appearance } = useAppearance();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            {appearance?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={appearance.logo_url} alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                P
              </div>
            )}
            <span className="text-lg font-semibold text-sidebar-foreground">
              PressUp CMS
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
          <div className="space-y-6">
            {navigation.map((section) => (
              <div key={section.title}>
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    // Exact match only - no parent highlighting
                    const isActive = pathname === item.href;
                    
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                          )}
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="flex-1">{item.title}</span>
                          {isActive && (
                            <ChevronRight className="h-4 w-4 text-primary" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="text-xs text-sidebar-foreground/50 text-center">
            Powered by <span className="font-semibold">PressUp</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
