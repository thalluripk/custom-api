import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Web API Documentation',
            version: '1.0.0',
            description: 'REST API with user authentication and product management',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
            {
                url: process.env.API_URL || 'https://web-api-dev.azurewebsites.net',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token for authentication',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                        },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                        },
                        name: {
                            type: 'string',
                        },
                    },
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                        },
                        name: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                        price: {
                            type: 'number',
                            format: 'float',
                        },
                        stock: {
                            type: 'integer',
                        },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                        },
                        token: {
                            type: 'string',
                        },
                        user: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                },
                ProductsResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                        },
                        products: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Product',
                            },
                        },
                    },
                },
                ProductResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                        },
                        product: {
                            $ref: '#/components/schemas/Product',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
