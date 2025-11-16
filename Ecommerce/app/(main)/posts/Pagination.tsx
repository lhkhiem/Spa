'use client';

import Link from 'next/link';

interface PaginationProps {
  totalPages: number;
  currentPage?: number;
}

export default function Pagination({ totalPages, currentPage = 1 }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={`/posts?page=${page}`}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? 'border-red-700 bg-red-700 text-white shadow-sm hover:bg-red-800'
                : 'border-red-200 bg-red-50/80 text-red-800 hover:border-red-300 hover:bg-red-100 hover:text-red-900'
            }`}
          >
            {page}
          </Link>
        );
      })}
    </div>
  );
}

