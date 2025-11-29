'use client';

import { FiShare2 } from 'react-icons/fi';
import { buildSiteUrl } from '@/config/site';

interface ShareButtonProps {
  title: string;
  excerpt: string | null;
  url: string;
}

export default function ShareButton({ title, excerpt, url }: ShareButtonProps) {
  // Fix URL if it contains localhost (server-side render issue)
  const getShareUrl = (): string => {
    if (typeof window === 'undefined') return url;
    
    // If URL contains localhost, replace with current origin
    if (url.includes('localhost')) {
      const currentOrigin = window.location.origin;
      const path = url.replace(/^https?:\/\/[^/]+/, '');
      return `${currentOrigin}${path}`;
    }
    
    return url;
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    const shareUrl = getShareUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt || '',
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Đã sao chép link!');
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
    >
      <FiShare2 className="mr-2 h-4 w-4" />
      Chia sẻ
    </button>
  );
}

