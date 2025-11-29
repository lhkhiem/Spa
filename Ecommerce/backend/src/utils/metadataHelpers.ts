export function stripHtmlAndDecode(text: string): string {
  if (!text) return '';
  let cleaned = text.replace(/<[^>]*>/g, '');
  cleaned = cleaned.replace(/&#(\d+);/g, (match, dec) => {
    try {
      return String.fromCharCode(parseInt(dec, 10));
    } catch {
      return match;
    }
  });
  cleaned = cleaned.replace(/&#x([0-9A-Fa-f]+);/gi, (match, hex) => {
    try {
      return String.fromCharCode(parseInt(hex, 16));
    } catch {
      return match;
    }
  });
  const entities: { [key: string]: string } = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39': "'",
  };
  for (const [entity, char] of Object.entries(entities)) {
    cleaned = cleaned.replace(new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), char);
  }
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

export function normalizeSlug(slug: string): string {
  if (!slug) return '';
  try {
    slug = decodeURIComponent(slug);
  } catch {
    // ignore
  }
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}




