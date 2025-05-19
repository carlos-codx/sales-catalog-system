import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequestBody = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
  }
};