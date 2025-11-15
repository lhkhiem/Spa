import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import sequelize from '../config/database';

const DEFAULTS: Record<string, any> = {
  general: {
    siteName: 'PressUp CMS',
    siteDescription: 'A powerful content management system',
    siteUrl: 'https://example.com',
    adminEmail: 'admin@pressup.com',
    businessInfo: { company: '', address: '', taxCode: '', phone: '', email: '' },
    socialLinks: { facebook: '', youtube: '', tiktok: '', linkedin: '', twitter: '' },
  },
  appearance: {
    themeMode: 'system',
    primaryColor: '#8b5cf6',
    logo_asset_id: null,
    logo_url: '',
    favicon_asset_id: null,
    favicon_url: '',
  },
  email: {
    smtpHost: '',
    smtpPort: 587,
    encryption: 'tls',
    fromEmail: '',
    fromName: 'PressUp CMS',
    username: '',
    password: '',
    enabled: false,
  },
  notifications: {
    newPost: true,
    newUser: true,
    newComment: true,
    systemUpdates: true,
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 60,
    passwordPolicy: { minLength: 8, uppercase: true, numbers: true, special: false },
  },
  advanced: {
    apiBaseUrl: 'http://localhost:3011',
    cacheStrategy: 'memory',
  },
  seo: {
    home: { title: 'Home - PressUp', description: '', headScript: '', bodyScript: '', slug: '/' },
    pages: [],
  },
  homepage_metrics: {
    activeCustomers: '84000+',
    countriesServed: '47',
    yearsInBusiness: '40+',
  },
};

export const getNamespace = async (req: Request, res: Response) => {
  try {
    const { namespace } = req.params;
    const row = await sequelize.query('SELECT value FROM settings WHERE namespace = :ns', {
      type: 'SELECT' as any,
      replacements: { ns: namespace },
    });
    const val = (row as any[])[0]?.value ?? DEFAULTS[namespace] ?? {};
    res.json({ namespace, value: val });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load settings' });
  }
};

export const putNamespace = async (req: AuthRequest, res: Response) => {
  try {
    // Require auth but allow any logged-in user to save for now; could restrict by role
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { namespace } = req.params;
    const value = req.body;
    await sequelize.query(
      `INSERT INTO settings (namespace, value, updated_at)
       VALUES (:ns, :val::jsonb, NOW())
       ON CONFLICT (namespace) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      { type: 'INSERT' as any, replacements: { ns: namespace, val: JSON.stringify(value) } }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
};

export const clearCache = async (_req: AuthRequest, res: Response) => {
  // TODO: Hook into real cache layer (redis/memory). For now, stub success.
  res.json({ ok: true, message: 'Cache cleared' });
};

export const resetDefaults = async (req: AuthRequest, res: Response) => {
  try {
    const scope = req.body?.scope || 'appearance';
    const defaults = DEFAULTS[scope] ?? {};
    await sequelize.query(
      `INSERT INTO settings (namespace, value, updated_at)
       VALUES (:ns, :val::jsonb, NOW())
       ON CONFLICT (namespace) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      { type: 'INSERT' as any, replacements: { ns: scope, val: JSON.stringify(defaults) } }
    );
    res.json({ ok: true, defaults });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset defaults' });
  }
};
