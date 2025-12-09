import { Router, Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import { db, User } from '../db';
import { generateToken } from '../auth';
import { AuthRequest } from '../middleware';

const router = Router();

// Helper function to generate UUID
const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
// @route POST /api/auth/register
// @description Register a new user
interface RegisterBody {
    email: string;
    password: string;
    name: string;
}

router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body as RegisterBody;

        if (!email || !password || !name) {
            res.status(400).json({ error: 'Email, password, and name are required' });
            return;
        }

        const existingUser = db.findUserByEmail(email);
        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = generateId();

        const newUser: User = {
            id: userId,
            email,
            password: hashedPassword,
            name,
        };

        db.addUser(newUser);

        const token = generateToken(userId, email);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: userId, email, name },
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
// @route POST /api/auth/login
// @description Login user
interface LoginBody {
    email: string;
    password: string;
}

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as LoginBody;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const user = db.findUserByEmail(email);
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const token = generateToken(user.id, user.email);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
