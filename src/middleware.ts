import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth';

export interface AuthRequest extends Request {
    userId?: string;
    email?: string;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    const payload = verifyToken(token);

    if (!payload) {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }

    req.userId = payload.userId;
    req.email = payload.email;
    next();
};
