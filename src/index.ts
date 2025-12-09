import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
        url: '/api/docs.json',
        displayOperationId: true,
        deepLinking: true,
    },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Swagger JSON endpoint
app.get('/api/docs.json', (req: Request, res: Response): void => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response): void => {
    res.status(200).json({ message: 'Server is running' });
});

// 404 handler
app.use((req: Request, res: Response): void => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response): void => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
