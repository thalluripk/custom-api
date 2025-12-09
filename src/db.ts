// Mock database - In production, use a real database
export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
}

class Database {
    private users: User[] = [];
    private products: Product[] = [];

    constructor() {
        // Initialize with sample products
        this.products = [
            {
                id: '1',
                name: 'Laptop',
                description: 'High-performance laptop',
                price: 999.99,
                stock: 10,
            },
            {
                id: '2',
                name: 'Mouse',
                description: 'Wireless mouse',
                price: 29.99,
                stock: 50,
            },
            {
                id: '3',
                name: 'Keyboard',
                description: 'Mechanical keyboard',
                price: 89.99,
                stock: 25,
            },
            {
                id: '4',
                name: 'Monitor',
                description: '4K Monitor',
                price: 399.99,
                stock: 15,
            },
        ];
    }

    // User operations
    addUser(user: User): void {
        this.users.push(user);
    }

    findUserByEmail(email: string): User | undefined {
        return this.users.find((u) => u.email === email);
    }

    // Product operations
    getProducts(): Product[] {
        return this.products;
    }

    getProductById(id: string): Product | undefined {
        return this.products.find((p) => p.id === id);
    }
}

export const db = new Database();
