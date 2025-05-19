import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequestQuery = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.body = schema.parse(req.query);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.errors });
  }
};