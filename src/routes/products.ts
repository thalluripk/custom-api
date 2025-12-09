import { Router, Response, Request } from 'express';
import { db } from '../db';
import { authMiddleware, AuthRequest } from '../middleware';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all available products (requires authentication)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsResponse'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Server error
 */
// @route GET /api/products
// @description Get all products
// @access Private
router.get('/', authMiddleware, (req: AuthRequest, res: Response): void => {
    try {
        const products = db.getProducts();
        res.status(200).json({
            message: 'Products retrieved successfully',
            products,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product details by ID
 *     description: Retrieve detailed information about a specific product (requires authentication)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
// @route GET /api/products/:id
// @description Get product details by ID
// @access Private
router.get('/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
    try {
        const { id } = req.params;
        const product = db.getProductById(id);

        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        res.status(200).json({
            message: 'Product retrieved successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
