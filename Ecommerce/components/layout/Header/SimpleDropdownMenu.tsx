'use client';

import Link from 'next/link';
import { MegaMenuData } from '@/lib/types/megaMenu';

interface SimpleDropdownMenuProps {
  data: MegaMenuData;
  isOpen: boolean;
}

export default function SimpleDropdownMenu({ data, isOpen }: SimpleDropdownMenuProps) {
  if (!isOpen) return null;

  // Flatten all items from all columns into a single list
  const allItems = data.columns.flatMap((column) => column.items);

  return (
    <div className="absolute left-0 top-full z-50 pt-2">
      <div className="min-w-[220px] max-w-[280px] rounded-lg bg-white shadow-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="py-1.5">
          {allItems.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#98131b] transition-all duration-200 relative group"
            >
              <span className="relative z-10 flex items-center">
                <span className="flex-1">{item.title}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </span>
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#98131b] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

