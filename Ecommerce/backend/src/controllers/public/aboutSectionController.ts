import { Request, Response } from 'express';
import axios from 'axios';
import { normalizeMediaUrl } from '../../utils/domainUtils';

const CMS_BACKEND_URL = process.env.CMS_BACKEND_URL || 'http://localhost:3011';

/**
 * Public About Section Controller
 * 
 * Fetches About sections from CMS backend and exposes them to the Ecommerce frontend.
 * Normalizes image URLs to use ecommerce-api.banyco.vn domain.
 */
export const getAboutSections = async (req: Request, res: Response) => {
  try {
    const { active_only, section_key } = req.query;

    const params: any = { active_only: active_only || 'true' };
    if (section_key) {
      params.section_key = section_key;
    }

    const response = await axios.get(`${CMS_BACKEND_URL}/api/about-sections`, {
      params,
    });

    // Normalize image URLs in response data
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map((section: any) => {
        if (section.image_url) {
          const normalizedUrl = normalizeMediaUrl(section.image_url);
          if (normalizedUrl) {
            section.image_url = normalizedUrl;
            console.log(`[getAboutSections] Normalized image URL: ${section.image_url} -> ${normalizedUrl}`);
          }
        }
        return section;
      });
    }

    res.json(response.data);
  } catch (error: any) {
    console.error('[getAboutSections] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch about sections',
    });
  }
};


