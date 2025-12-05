import { Request, Response } from 'express';
import sequelize from '../../config/database';
import { QueryTypes } from 'sequelize';
import { normalizeMediaUrl } from '../../utils/domainUtils';

/**
 * Public Settings Controller
 *
 * Exposes read-only settings needed by the Ecommerce frontend.
 * CRUD for settings is handled exclusively in the CMS backend.
 *
 * NOTE:
 * - We only expose the minimal fields required for the storefront
 *   (currently logo + favicon under the "appearance" namespace).
 */

interface AppearanceSettingsRow {
  value?: {
    logo_asset_id?: string | null;
    logo_url?: string | null;
    favicon_asset_id?: string | null;
    favicon_url?: string | null;
    ecommerce_logo_asset_id?: string | null;
    ecommerce_logo_url?: string | null;
    ecommerce_favicon_asset_id?: string | null;
    ecommerce_favicon_url?: string | null;
    topBannerText?: string | null;
    // Other appearance fields exist but are not used here
    [key: string]: any;
  };
}

export const getAppearanceSettings = async (_req: Request, res: Response) => {
  try {
    const result = await sequelize.query<AppearanceSettingsRow>(
      'SELECT value FROM settings WHERE namespace = :ns',
      {
        type: QueryTypes.SELECT,
        replacements: { ns: 'appearance' },
      }
    );

    const row = result[0];
    const rawValue = row?.value || {};

    // Prefer ecommerce-specific branding; fallback to general logo/fav if not set
    const logoUrl =
      rawValue.ecommerce_logo_url ||
      rawValue.logo_url ||
      null;
    const faviconUrl =
      rawValue.ecommerce_favicon_url ||
      rawValue.favicon_url ||
      null;

    const responsePayload = {
      logo_asset_id: rawValue.ecommerce_logo_asset_id || rawValue.logo_asset_id || null,
      favicon_asset_id: rawValue.ecommerce_favicon_asset_id || rawValue.favicon_asset_id || null,
      logo_url: logoUrl,
      favicon_url: faviconUrl,
      topBannerText: rawValue.topBannerText || null,
      // Normalized URLs for direct use on the storefront
      logoUrl: normalizeMediaUrl(logoUrl),
      faviconUrl: normalizeMediaUrl(faviconUrl),
    };

    return res.json({
      success: true,
      data: responsePayload,
    });
  } catch (error: any) {
    console.error('[PublicSettings] Failed to load appearance settings:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to load appearance settings',
    });
  }
};

interface GeneralSettingsRow {
  value?: {
    businessInfo?: {
      company?: string;
      address?: string;
      taxCode?: string;
      phone?: string;
      email?: string;
    };
    workingHours?: {
      mondayFriday?: string;
      saturday?: string;
      sunday?: string;
      phoneHours?: string;
      emailResponse?: string;
    };
    [key: string]: any;
  };
}

export const getGeneralSettings = async (_req: Request, res: Response) => {
  try {
    const result = await sequelize.query<GeneralSettingsRow>(
      'SELECT value FROM settings WHERE namespace = :ns',
      {
        type: QueryTypes.SELECT,
        replacements: { ns: 'general' },
      }
    );

    const row = result[0];
    const rawValue = row?.value || {};

    // Only expose business info and working hours for public use
    const responsePayload = {
      businessInfo: rawValue.businessInfo || {},
      workingHours: rawValue.workingHours || {},
    };

    return res.json({
      success: true,
      data: responsePayload,
    });
  } catch (error: any) {
    console.error('[PublicSettings] Failed to load general settings:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to load general settings',
    });
  }
};


