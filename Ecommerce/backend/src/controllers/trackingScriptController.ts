// Tracking Script Controller
// Ecommerce Backend - Only public endpoint (getActiveScripts)

import { Request, Response } from 'express';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

// Get active scripts for frontend (public endpoint)
export const getActiveScripts = async (req: Request, res: Response) => {
  try {
    const { page = 'all' } = req.query;

    // Build query to check if page matches
    const query = `
      SELECT id, name, type, provider, position, script_code, load_strategy, priority
      FROM tracking_scripts
      WHERE is_active = TRUE
        AND (
          pages @> '["all"]'::jsonb 
          OR pages @> :page::jsonb
        )
      ORDER BY priority ASC, created_at ASC
    `;

    const result: any = await sequelize.query(query, {
      replacements: { page: JSON.stringify([page]) },
      type: QueryTypes.SELECT,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to fetch active tracking scripts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch active tracking scripts' });
  }
};

// Note: Admin CRUD functions (getTrackingScripts, createTrackingScript, etc.) 
// are not available in Ecommerce Backend - these are CMS Backend only
