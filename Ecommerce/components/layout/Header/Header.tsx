'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown, FiPackage } from 'react-icons/fi';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import MegaMenu from './MegaMenu';
import { getMenuItems } from '@/lib/cms';
import type { CMSMenuItem } from '@/lib/types/cms';
import type { MegaMenuData } from '@/lib/types/megaMenu';
import {
  equipmentSuppliesMegaMenu,
  productsMegaMenu,
  equipmentMegaMenu,
  brandsMegaMenu,
} from '@/lib/data/megaMenuData';

interface NavigationItem {
  id: string;
  name: string;
  href: string;
  megaMenu?: MegaMenuData;
}

const MENU_IDENTIFIER = process.env.NEXT_PUBLIC_CMS_MAIN_MENU_ID || 'main-menu';

const FALLBACK_NAVIGATION: NavigationItem[] = [
  {
    id: 'equipment-supplies',
    name: 'Thiết Bị & Vật Tư',
    href: '/categories',
    megaMenu: equipmentSuppliesMegaMenu,
  },
  {
    id: 'products',
    name: 'Sản Phẩm',
    href: '/products',
    megaMenu: productsMegaMenu,
  },
  {
    id: 'equipment',
    name: 'Thiết Bị',
    href: '/equipment',
    megaMenu: equipmentMegaMenu,
  },
  { id: 'modalities', name: 'Phương Thức', href: '/modalities' },
  {
    id: 'brands',
    name: 'Thương Hiệu',
    href: '/brands',
    megaMenu: brandsMegaMenu,
  },
  { id: 'deals', name: 'Ưu Đãi!', href: '/deals' },
];

const normalizeMenuHref = (raw?: string | null, fallbackSlug?: string) => {
  const trimmed = (raw ?? '').trim();

  if (trimmed) {
    if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed) || trimmed === '#') {
      return trimmed;
    }

    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  if (fallbackSlug) {
    const normalized = fallbackSlug.startsWith('/') ? fallbackSlug : `/${fallbackSlug}`;
    return normalized.replace(/\/{2,}/g, '/');
  }

  return '#';
};

const toNumber = (value: number | string | null | undefined, fallback: number) => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const toTimestamp = (value: string | null | undefined) => {
  if (!value) {
    return 0;
  }

  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
};

const sortMenuNodes = (items: CMSMenuItem[]): CMSMenuItem[] => {
  return [...items].sort((a, b) => {
    const orderDiff =
      toNumber(a.sort_order, Number.MAX_SAFE_INTEGER) - toNumber(b.sort_order, Number.MAX_SAFE_INTEGER);

    if (orderDiff !== 0) {
      return orderDiff;
    }

    const createdDiff = toTimestamp(a.created_at) - toTimestamp(b.created_at);
    if (createdDiff !== 0) {
      return createdDiff;
    }

    return a.title.localeCompare(b.title);
  });
};

const filterActive = (items: CMSMenuItem[] | undefined) =>
  (items ?? []).filter((item) => item && item.is_active !== false);

const buildMegaMenuFromTree = (root: CMSMenuItem): MegaMenuData | undefined => {
  const levelTwo = sortMenuNodes(filterActive(root.children));
  if (!levelTwo.length) {
    return undefined;
  }

  const columns = levelTwo
    .map((section) => {
      const levelThree = sortMenuNodes(filterActive(section.children));

      if (levelThree.length) {
        return {
          id: `${section.id}-col`,
          title: section.title,
          items: levelThree.map((leaf) => ({
            id: leaf.id,
            title: leaf.title,
            href: normalizeMenuHref(leaf.url),
          })),
        };
      }

      return {
        id: `${section.id}-col`,
        title: '',
        items: [
          {
            id: section.id,
            title: section.title,
            href: normalizeMenuHref(section.url),
          },
        ],
      };
    })
    .filter((column) => column.items.length);

  return columns.length
    ? {
        id: `${root.id}-mega`,
        columns,
      }
    : undefined;
};

const transformCmsMenuItems = (items: CMSMenuItem[]): NavigationItem[] => {
  if (!Array.isArray(items) || !items.length) {
    return [];
  }

  const topLevel = sortMenuNodes(filterActive(items));

  return topLevel.map((item) => ({
    id: item.id,
    name: item.title,
    href: normalizeMenuHref(item.url),
    megaMenu: buildMegaMenuFromTree(item),
  }));
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [navigation, setNavigation] = useState<NavigationItem[]>(FALLBACK_NAVIGATION);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadMenu = async () => {
      try {
        const items = await getMenuItems(MENU_IDENTIFIER);
        if (isCancelled) {
          return;
        }

        const cmsNavigation = transformCmsMenuItems(items);
        if (cmsNavigation.length) {
          setNavigation(cmsNavigation);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('[Header] Failed to load CMS main menu', error);
          setNavigation(FALLBACK_NAVIGATION);
        }
      }
    };

    loadMenu();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
          : 'bg-white shadow-sm'
      }`}
    >
      {/* Top Banner - Always visible */}
      <div className="w-full bg-white py-2 text-center text-sm text-brand-purple-600 font-medium">
        Miễn phí vận chuyển cho đơn hàng trên $749+ | $4.99 vận chuyển cho đơn hàng trên $199+
      </div>

      {/* Main Header - Full Width Red Background */}
      <div className="w-full bg-brand-purple-600">
        <div className="container-custom">
          <div className="flex items-center justify-between py-2.5">
            {/* Logo */}
            <Link href="/" className="flex items-center py-2">
              <Image
                src="/images/banyco-logo.jpg"
                alt="Banyco"
                width={120}
                height={60}
                className="h-auto w-auto max-h-[50px] object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-1 lg:flex">
              {navigation.map((item) => (
                <div
                  key={item.id}
                  className="group relative"
                  onMouseEnter={() => item.megaMenu && setActiveMegaMenu(item.id)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white hover:text-gray-200 transition-colors"
                  >
                    {item.name}
                    {item.megaMenu && (
                      <FiChevronDown
                        className={`h-4 w-4 transition-transform ${
                          activeMegaMenu === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>
                  {item.megaMenu && (
                    <div className="absolute left-1/2 -translate-x-1/2 w-screen">
                      <MegaMenu
                        data={item.megaMenu}
                        isOpen={activeMegaMenu === item.id}
                      />
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button className="text-white hover:text-gray-200">
                <FiSearch className="h-5 w-5" />
              </button>

              {/* Order Lookup by Phone */}
              <Link 
                href="/order-lookup" 
                className="text-white hover:text-gray-200"
                title="Tra cứu đơn hàng"
              >
                <FiPackage className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative text-white hover:text-gray-200">
                <FiShoppingCart className="h-5 w-5" />
                {isHydrated && totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-brand-purple-600">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="w-full bg-white">
          <div className="container-custom">
            <nav className="border-t py-4 lg:hidden">
              <div className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <div key={item.id}>
                    {item.megaMenu ? (
                      <button
                        onClick={() => setActiveMegaMenu(activeMegaMenu === item.id ? null : item.id)}
                        className="flex w-full items-center justify-between py-2 text-left text-gray-700 hover:text-brand-purple-600"
                      >
                        <span>{item.name}</span>
                        <FiChevronDown
                          className={`h-4 w-4 transition-transform ${
                            activeMegaMenu === item.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-between py-2 text-left text-gray-700 hover:text-brand-purple-600"
                      >
                        {item.name}
                      </Link>
                    )}
                    {item.megaMenu && activeMegaMenu === item.id && (
                      <div className="ml-4 mt-2 space-y-3 border-l-2 border-gray-200 pl-4">
                        {item.megaMenu.columns.map((column) => (
                          <div key={column.id}>
                            {column.title && (
                              <p className="mb-1 text-sm font-semibold text-gray-900">
                                {column.title}
                              </p>
                            )}
                            <ul className="space-y-1">
                              {column.items.map((subItem) => (
                                <li key={subItem.id}>
                                  <Link
                                    href={subItem.href}
                                    className="block py-1 text-sm text-gray-600 hover:text-brand-purple-600"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {subItem.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
