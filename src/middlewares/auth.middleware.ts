import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({
      status: 401,
      message: 'No se ha proporcionado un token de autenticación',
      error: true,
    });
    return
  }

  try {

    const secretTOken = process.env.JWT_SECRET ?? null;

    if (!secretTOken) {
      res.status(401).json({
        status: 401,
        message: 'La sesión ha expirado o es inválida, intenta nuevamente',
        error: true,
      });
      return;
    }

    const decoded = jwt.verify(token, secretTOken);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({
      status: 401,
      message: 'La sesión ha expirado o es inválida, intenta nuevamente',
      error: true,
    });
    return;
  }
};