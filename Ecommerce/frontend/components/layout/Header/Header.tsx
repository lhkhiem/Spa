'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown, FiPackage } from 'react-icons/fi';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import SimpleDropdownMenu from './SimpleDropdownMenu';
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

// Get menu identifier from environment variable (required, no hardcode fallback)
const MENU_IDENTIFIER = process.env.NEXT_PUBLIC_MAIN_MENU_ID || process.env.NEXT_PUBLIC_CMS_MAIN_MENU_ID;

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
    // Allow external/mail links and explicit '#'
    if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed) || trimmed === '#') {
      return trimmed;
    }

    // Strip trailing '#' (e.g., '/brands#' -> '/brands')
    const withoutTrailingHash = trimmed.endsWith('#') ? trimmed.slice(0, -1) : trimmed;

    const ensuredSlash = withoutTrailingHash.startsWith('/')
      ? withoutTrailingHash
      : `/${withoutTrailingHash}`;

    return ensuredSlash.replace(/\/{2,}/g, '/');
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

  return topLevel.map((item) => {
    const rawHref = normalizeMenuHref(item.url);
    const titleLower = (item.title || '').toLowerCase();

    // Fix common CMS mis-links: map deals/ưu đãi menu to '/deals'
    let href = rawHref;
    if (
      (titleLower.includes('ưu đãi') || titleLower.includes('save now')) &&
      (href === '#' || href === '/brands' || href === '/brands/' || href === '/brands#')
    ) {
      href = '/deals';
    }

    return {
      id: item.id,
      name: item.title,
      href,
      megaMenu: buildMegaMenuFromTree(item),
    } as NavigationItem;
  });
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
      <div className="w-full bg-white py-2 text-center text-sm text-[#98131b] font-medium">
        Miễn phí vận chuyển cho đơn hàng trên 749.000₫+ | 4.990₫ vận chuyển cho đơn hàng trên 199.000₫+
      </div>

      {/* Main Header - Full Width Red Background */}
      <div className="w-full bg-[#98131b]">
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
                    className={`flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 rounded-md ${
                      activeMegaMenu === item.id
                        ? 'bg-white/10 text-white'
                        : 'hover:bg-white/5 hover:text-gray-100'
                    }`}
                  >
                    {item.name}
                    {item.megaMenu && (
                      <FiChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          activeMegaMenu === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>
                  {item.megaMenu && (
                    <div
                      className="absolute left-0"
                      onMouseEnter={() => setActiveMegaMenu(item.id)}
                      onMouseLeave={() => setActiveMegaMenu(null)}
                    >
                      <SimpleDropdownMenu
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
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-[#98131b]">
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
                      <>
                        <button
                          onClick={() => setActiveMegaMenu(activeMegaMenu === item.id ? null : item.id)}
                          className="flex w-full items-center justify-between py-2 text-left text-gray-700 hover:text-red-600 transition-colors"
                        >
                          <span>{item.name}</span>
                          <FiChevronDown
                            className={`h-4 w-4 transition-transform ${
                              activeMegaMenu === item.id ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {activeMegaMenu === item.id && (
                          <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                            {item.megaMenu.columns.flatMap((column) => column.items).map((subItem) => (
                              <Link
                                key={subItem.id}
                                href={subItem.href}
                                className="block py-1.5 text-sm text-gray-600 hover:text-[#98131b] transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-between py-2 text-left text-gray-700 hover:text-red-600 transition-colors"
                      >
                        {item.name}
                      </Link>
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
