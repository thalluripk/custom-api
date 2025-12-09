import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export interface JWTPayload {
    userId: string;
    email: string;
}

export const generateToken = (userId: string, email: string): string => {
    const p: JWTPayload = { userId, email };
    return jwt.sign(p, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): JWTPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
};
