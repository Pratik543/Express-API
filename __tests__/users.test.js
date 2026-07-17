/**
 * Tests for user routes
 */

const request = require('supertest');
const { app } = require('../src/server');

describe('User Routes', () => {
  describe('GET /api/v1/users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/api/v1/users');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return user by ID', async () => {
      const response = await request(app).get('/api/v1/users/1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/api/v1/users/999');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };
      const response = await request(app)
        .post('/api/v1/users')
        .send(newUser);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', 'Test User');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update existing user', async () => {
      const updatedUser = { name: 'Updated Name' };
      const response = await request(app)
        .put('/api/v1/users/1')
        .send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', 'Updated Name');
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should delete user', async () => {
      const response = await request(app).delete('/api/v1/users/1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
