import { Request, Response } from 'express';
export declare const getTopics: (req: Request, res: Response) => Promise<void>;
export declare const getTopicById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTopic: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTopic: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTopic: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTopicsOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=topicController.d.ts.map