import { Request, Response } from 'express';
import axios from 'axios';

const CMS_BACKEND_URL = process.env.CMS_BACKEND_URL || 'http://localhost:3011';

/**
 * Public FAQ Controller
 * 
 * Fetches FAQs from CMS backend and exposes them to the Ecommerce frontend.
 */
export const getFAQs = async (req: Request, res: Response) => {
  try {
    const { active_only } = req.query;

    const response = await axios.get(`${CMS_BACKEND_URL}/api/faqs/public`, {
      params: { active_only: active_only || 'true' },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('[getFAQs] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQs',
    });
  }
};




