import { Request, Response } from 'express';
import { CreateActivityLogDTO } from '../models/ActivityLog';
export declare const getRecentActivities: (req: Request, res: Response) => Promise<void>;
export declare const createActivityLog: (data: CreateActivityLogDTO) => Promise<void>;
export declare const logActivity: (req: Request, action: string, entityType: string, entityId?: string, entityName?: string, description?: string, metadata?: Record<string, unknown>) => Promise<void>;
//# sourceMappingURL=activityLogController.d.ts.map