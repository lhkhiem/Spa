'use client';

import Link from 'next/link';
import { MegaMenuData } from '@/lib/types/megaMenu';

interface MegaMenuProps {
  data: MegaMenuData;
  isOpen: boolean;
}

export default function MegaMenu({ data, isOpen }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-50 bg-white shadow-2xl border-t border-gray-200 pt-8">
      <div className="container mx-auto max-w-7xl px-4 pb-8">
        <div className={`grid ${
          data.columns.length === 6 ? 'grid-cols-6 gap-4' :
          data.columns.length === 4 ? 'grid-cols-4 gap-6' :
          data.columns.length === 3 ? 'grid-cols-3 gap-8' :
          'grid-cols-2 gap-8'
        }`}>
          {data.columns.map((column) => (
            <div key={column.id} className="space-y-3">
              {column.title && (
                <h3 className="font-bold text-sm text-gray-900 border-b border-gray-300 pb-2 mb-3">
                  {column.title}
                </h3>
              )}
              <ul className="space-y-2">
                {column.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="block text-sm text-gray-600 hover:text-brand-purple-600 hover:translate-x-1 transition-all duration-200"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {data.featured && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <Link
              href={data.featured.href}
              className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {data.featured.title}
                </h4>
                <p className="text-sm text-gray-600">{data.featured.description}</p>
              </div>
              <svg
                className="h-5 w-5 text-brand-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
