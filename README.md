# Web API

A Node.js/TypeScript REST API with user authentication and product management.

## Features

- User Registration
- User Login with JWT Authentication
- Product Listing
- Product Details (Protected Route)

## Technologies

- Node.js
- TypeScript
- Express.js
- JWT (JSON Web Tokens)
- bcryptjs for password hashing

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

## API Endpoints

### Authentication Routes

#### Register User
- **Method**: POST
- **Endpoint**: `/api/auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```

#### Login User
- **Method**: POST
- **Endpoint**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```

### Product Routes

#### Get All Products
- **Method**: GET
- **Endpoint**: `/api/products`
- **Authentication**: Not required
- **Response**:
  ```json
  {
    "message": "Products retrieved successfully",
    "products": [
      {
        "id": "1",
        "name": "Laptop",
        "description": "High-performance laptop",
        "price": 999.99,
        "stock": 10
      }
    ]
  }
  ```

#### Get Product Details
- **Method**: GET
- **Endpoint**: `/api/products/:id`
- **Authentication**: Required (Bearer Token)
- **Headers**:
  ```
  Authorization: Bearer <jwt_token>
  ```
- **Response**:
  ```json
  {
    "message": "Product retrieved successfully",
    "product": {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 999.99,
      "stock": 10
    }
  }
  ```

### Health Check

#### Server Health
- **Method**: GET
- **Endpoint**: `/health`
- **Response**:
  ```json
  {
    "message": "Server is running"
  }
  ```

## Usage Example

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Get All Products
```bash
curl -X GET http://localhost:3000/api/products
```

### 4. Get Product Details (Requires Authentication)
```bash
curl -X GET http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer <jwt_token>"
```

## Project Structure

```
src/
├── index.ts          # Main application entry point
├── db.ts             # Database and data models
├── auth.ts           # JWT token utilities
├── middleware.ts     # Express middleware (authentication)
└── routes/
    ├── auth.ts       # Authentication routes
    └── products.ts   # Product routes
```

## License

MIT
