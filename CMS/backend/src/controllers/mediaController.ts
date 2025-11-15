import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import MediaFolder from '../models/MediaFolder';
import Asset from '../models/Asset';
import { processImage, deleteImageFiles, getFileSize } from '../utils/media';
import { Op } from 'sequelize';

// GET /api/media/folders - list all folders with hierarchy
export const listFolders = async (_req: Request, res: Response) => {
  try {
    console.log('[listFolders] Fetching all folders...');
    const folders = await MediaFolder.findAll({
      order: [['parent_id', 'ASC'], ['name', 'ASC']],
    });
    console.log('[listFolders] Found', folders.length, 'folders');

    // Add file count for each folder
    const foldersWithCount = await Promise.all(
      folders.map(async (folder: any) => {
        const count = await Asset.count({
          where: { folder_id: folder.id }
        });
        return {
          ...folder.toJSON(),
          file_count: count
        };
      })
    );

    console.log('[listFolders] Returning folders with counts');
    res.json({ folders: foldersWithCount });
  } catch (error: any) {
    console.error('[listFolders] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/media/folders - create new folder
export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name, parent_id } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Folder name is required' });
    }
    const folder = await MediaFolder.create({ name: name.trim(), parent_id: parent_id || null });
    res.status(201).json({ folder });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/media/folders/:id - rename folder
export const renameFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Folder name is required' });
    }

    const folder = await MediaFolder.findByPk(id);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    await folder.update({ name: name.trim() });
    res.json({ folder });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/media/folders/:id - delete folder (cascade children)
export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const folder = await MediaFolder.findByPk(id);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    await folder.destroy();
    res.json({ message: 'Folder deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/media/upload - upload media file
export const uploadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const uploadDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const uploadDir = path.join(process.cwd(), 'storage', 'uploads', uploadDate);
    const uniqueId = uuidv4();
    const fileId = path.join(uploadDate, uniqueId);

    // Create unique folder for this upload
    const specificDir = path.join(uploadDir, uniqueId);

    // Process image (create thumbnails)
    const processed = await processImage(file.path, specificDir, file.originalname);

    // Get file size
    const fileSize = getFileSize(file.path);

    // Store in database
    // Validate folder_id - must be valid UUID or null
    console.log('[uploadMedia] Received folder_id:', req.body.folder_id);
    let validFolderId = null;
    if (req.body.folder_id && req.body.folder_id !== '' && req.body.folder_id !== 'null') {
      // Check if it's a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(req.body.folder_id)) {
        validFolderId = req.body.folder_id;
        console.log('[uploadMedia] Valid folder_id:', validFolderId);
      } else {
        console.log('[uploadMedia] Invalid folder_id format, storing as null');
      }
    } else {
      console.log('[uploadMedia] No folder_id provided, storing as null');
    }

    const asset = await Asset.create({
      id: uuidv4(),
      type: 'image',
      provider: 'local',
      url: `/uploads/${fileId}/${processed.original}`,
      cdn_url: null,
      width: processed.width,
      height: processed.height,
      format: path.extname(file.originalname).substring(1),
      sizes: processed.sizes,
      folder_id: validFolderId,
    });

    // Add additional info for response
    const response = {
      ...asset.toJSON(),
      file_name: file.originalname,
      file_size: fileSize,
      thumb_url: `/uploads/${fileId}/${processed.thumb}`,
      medium_url: `/uploads/${fileId}/${processed.medium}`,
      large_url: `/uploads/${fileId}/${processed.large}`,
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('[uploadMedia] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/media - list all media with pagination and filters
export const listMedia = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      pageSize = 20, 
      search, 
      type,
      folder_id 
    } = req.query;

    const offset = ((page as any) - 1) * (pageSize as any);
    const where: any = {};

    // Filter by search
    if (search) {
      where.url = { [Op.iLike]: `%${search}%` };
    }

    // Filter by type
    if (type) {
      where.type = type;
    }

    // Filter by folder - validate UUID
    console.log('[listMedia] folder_id param:', folder_id);
    if (folder_id && folder_id !== '' && folder_id !== 'null' && folder_id !== 'undefined') {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(folder_id as string)) {
        where.folder_id = folder_id;
        console.log('[listMedia] Filtering by folder_id:', folder_id);
      } else {
        console.log('[listMedia] Invalid folder_id format:', folder_id);
      }
    } else if (folder_id === null || folder_id === 'null') {
      // Show only root level files (no folder)
      where.folder_id = null;
      console.log('[listMedia] Filtering for root-level files only');
    } else {
      console.log('[listMedia] No folder filter, showing all files');
    }
    // If folder_id is not provided, show all files

    const { count, rows } = await Asset.findAndCountAll({
      where,
      offset,
      limit: pageSize as any,
      order: [['created_at', 'DESC']],
    });

    // Add helper URLs for each asset
    const assetsWithUrls = rows.map((asset: any) => {
      const assetData = asset.toJSON();
      // URL format: /uploads/YYYY-MM-DD/uuid/filename.ext
      // Extract the directory part (everything except the filename)
      const urlParts = assetData.url.split('/');
      const directory = urlParts.slice(0, -1).join('/'); // /uploads/YYYY-MM-DD/uuid
      const fileName = urlParts[urlParts.length - 1]; // original_filename.ext
      
      // Try to get file size
      const filePath = path.join(process.cwd(), 'storage', assetData.url);
      const fileSize = getFileSize(filePath);
      
      return {
        ...assetData,
        file_name: fileName.replace('original_', ''),
        file_size: fileSize,
        thumb_url: assetData.sizes?.thumb ? `${directory}/${assetData.sizes.thumb}` : assetData.url,
        medium_url: assetData.sizes?.medium ? `${directory}/${assetData.sizes.medium}` : assetData.url,
        large_url: assetData.sizes?.large ? `${directory}/${assetData.sizes.large}` : assetData.url,
        original_url: assetData.url,
      };
    });

    res.json({
      data: assetsWithUrls,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / (pageSize as any)),
    });
  } catch (error: any) {
    console.error('[listMedia] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/media/:id - update media (move to folder)
export const updateMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { folder_id } = req.body;

    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Update folder_id (null for root)
    await asset.update({ 
      folder_id: folder_id === undefined ? (asset as any).folder_id : (folder_id || null)
    });

    res.json({ asset });
  } catch (error: any) {
    console.error('[updateMedia] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/media/:id/rename - rename media file
export const renameMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    if (!newName || newName.trim() === '') {
      return res.status(400).json({ error: 'New name is required' });
    }

    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const assetData = asset.toJSON() as any;
    
    // Extract current file information
    const urlParts = assetData.url.split('/');
    const directory = urlParts.slice(0, -1).join('/'); // /uploads/YYYY-MM-DD/uuid
    const oldFileName = urlParts[urlParts.length - 1]; // original_oldname.ext
    const fileExt = path.extname(oldFileName);
    
    // Clean new name and create new filenames
    const cleanNewName = newName.trim().replace(/\s+/g, '_');
    const baseName = path.basename(cleanNewName, fileExt);
    
    // Physical directory path
    const physicalDir = path.join(process.cwd(), 'storage', ...urlParts.slice(1, -1));
    
    // Rename all file versions
    const sizes = typeof assetData.sizes === 'string' 
      ? JSON.parse(assetData.sizes) 
      : assetData.sizes;
    
    const newSizes: any = {};
    
    try {
      // Rename thumb
      if (sizes.thumb) {
        const oldThumbPath = path.join(physicalDir, sizes.thumb);
        const newThumbName = `${baseName}_thumb.webp`;
        const newThumbPath = path.join(physicalDir, newThumbName);
        if (fs.existsSync(oldThumbPath)) {
          fs.renameSync(oldThumbPath, newThumbPath);
          newSizes.thumb = newThumbName;
        }
      }
      
      // Rename medium
      if (sizes.medium) {
        const oldMediumPath = path.join(physicalDir, sizes.medium);
        const newMediumName = `${baseName}_medium.webp`;
        const newMediumPath = path.join(physicalDir, newMediumName);
        if (fs.existsSync(oldMediumPath)) {
          fs.renameSync(oldMediumPath, newMediumPath);
          newSizes.medium = newMediumName;
        }
      }
      
      // Rename large
      if (sizes.large) {
        const oldLargePath = path.join(physicalDir, sizes.large);
        const newLargeName = `${baseName}_large.webp`;
        const newLargePath = path.join(physicalDir, newLargeName);
        if (fs.existsSync(oldLargePath)) {
          fs.renameSync(oldLargePath, newLargePath);
          newSizes.large = newLargeName;
        }
      }
      
      // Rename original
      if (sizes.original) {
        const oldOriginalPath = path.join(physicalDir, sizes.original);
        const newOriginalName = `original_${baseName}${fileExt}`;
        const newOriginalPath = path.join(physicalDir, newOriginalName);
        if (fs.existsSync(oldOriginalPath)) {
          fs.renameSync(oldOriginalPath, newOriginalPath);
          newSizes.original = newOriginalName;
        }
      }
      
      // Update database
      const newUrl = `${directory}/${newSizes.original || newSizes.original}`;
      await asset.update({
        url: newUrl,
        sizes: newSizes
      });
      
      console.log(`[renameMedia] Renamed file from ${oldFileName} to ${newSizes.original}`);
      res.json({ 
        message: 'File renamed successfully',
        asset: {
          ...assetData,
          url: newUrl,
          sizes: newSizes
        }
      });
      
    } catch (renameError) {
      console.error('[renameMedia] Error renaming files:', renameError);
      // Attempt to rollback any partial renames would go here
      throw new Error('Failed to rename file on disk');
    }
    
  } catch (error: any) {
    console.error('[renameMedia] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/media/:id - delete media file
export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);

    if (!asset) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete physical files
    const assetData = asset.toJSON() as any;
    if (assetData.sizes && assetData.url) {
      try {
        // Extract directory from URL: /uploads/YYYY-MM-DD/uuid/filename.ext
        const urlParts = assetData.url.split('/');
        // Remove empty first element and 'uploads', take date and uuid
        const pathParts = urlParts.filter(p => p).slice(1); // Remove 'uploads'
        const uploadDir = path.join(process.cwd(), 'storage', 'uploads', ...pathParts.slice(0, -1));
        
        // Parse sizes if it's a string (JSONB)
        const sizes = typeof assetData.sizes === 'string' 
          ? JSON.parse(assetData.sizes) 
          : assetData.sizes;
        
        deleteImageFiles(uploadDir, sizes);
      } catch (fileError) {
        console.error('[deleteMedia] Error deleting physical files:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from database
    await asset.destroy();

    res.json({ message: 'Media deleted successfully' });
  } catch (error: any) {
    console.error('[deleteMedia] Error:', error);
    res.status(500).json({ error: error.message });
  }
};
