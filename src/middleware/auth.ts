import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET');

export interface AuthRequest extends Request {
  id_user?: number;
};

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  };

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    // depends on token payload ({ userId: user.id_user })
    req.id_user = payload.userId;
    return next();
  } catch (err) {
    console.error('JWT verify error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
