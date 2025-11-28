import sequelize from '../config/database';

const DEFAULTS = {
  seo: {
    pages: [],
  },
};

/**
 * Remove metadata from CMS Settings when post/product is deleted
 */
export async function removeMetadataFromCMS(path: string) {
  try {
    // 1. Fetch current SEO settings
    const [seoRow] = await sequelize.query(
      'SELECT value FROM settings WHERE namespace = :ns',
      {
        type: 'SELECT' as any,
        replacements: { ns: 'seo' },
      }
    ) as any[];

    const seoSettings = seoRow?.[0]?.value ?? DEFAULTS.seo;
    const existingPages = seoSettings.pages || [];

    // 2. Remove metadata for this path
    const filteredPages = existingPages.filter((p: any) => p.path !== path);

    // 3. Save updated settings
    await sequelize.query(
      `INSERT INTO settings (namespace, value, updated_at)
       VALUES (:ns, :val::jsonb, NOW())
       ON CONFLICT (namespace) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      {
        type: 'INSERT' as any,
        replacements: {
          ns: 'seo',
          val: JSON.stringify({
            ...seoSettings,
            pages: filteredPages,
          }),
        },
      }
    );

    console.log(`[removeMetadataFromCMS] Removed metadata for ${path}`);
  } catch (error) {
    console.error('[removeMetadataFromCMS] Error:', error);
    // Don't throw error to avoid breaking deletion
  }
}



