import request from 'supertest';
import app from '../app'; // your Express app
import { describe, it, expect } from 'vitest';

describe('Order API Integration Tests', () => {
  it('should return 200 for GET /orders', async () => {
    const res = await request(app).get('/orders');
    expect(res.statusCode).toBe(200);
  });

  it('should create a new order on POST /orders', async () => {
    const res = await request(app)
      .post('/orders')
      .send({
        userId: 1,
        items: [{ gameId: 101, quantity: 2 }],
        total: 49.99
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
