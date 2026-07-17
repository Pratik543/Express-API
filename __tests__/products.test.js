/**
 * Tests for product routes
 */

const request = require('supertest');
const { app } = require('../src/server');

describe('Product Routes', () => {
  describe('GET /api/v1/products', () => {
    it('should return all products', async () => {
      const response = await request(app).get('/api/v1/products');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter products by category', async () => {
      const response = await request(app).get('/api/v1/products?category=Electronics');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.every(p => p.category === 'Electronics')).toBe(true);
    });

    it('should filter products by stock status', async () => {
      const response = await request(app).get('/api/v1/products?inStock=true');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.every(p => p.inStock === true)).toBe(true);
    });

    it('should search products by name', async () => {
      const response = await request(app).get('/api/v1/products?search=laptop');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return product by ID', async () => {
      const response = await request(app).get('/api/v1/products/1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/api/v1/products/999');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 99.99,
        category: 'Test',
        inStock: true,
      };
      const response = await request(app)
        .post('/api/v1/products')
        .send(newProduct);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', 'Test Product');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .send({ name: 'Test' });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    it('should update existing product', async () => {
      const updatedProduct = { price: 199.99 };
      const response = await request(app)
        .put('/api/v1/products/1')
        .send(updatedProduct);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('price', 199.99);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should delete product', async () => {
      const response = await request(app).delete('/api/v1/products/1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
