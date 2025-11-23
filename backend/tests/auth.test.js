// Authentication endpoint unit test

const request = require('supertest');
const app = require('../src/server');

describe('POST /api/v1/auth/login', () => {
  test('should return JWT token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@ciap.local',
        password: 'Admin123!'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.role).toBe('admin');
  });

  test('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@ciap.local',
        password: 'WrongPassword'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  test('should enforce rate limiting after 5 failed attempts', async () => {
    // Simulate 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@test.com', password: 'wrong' });
    }

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'wrong' });

    expect(response.status).toBe(429); // Too Many Requests
  });
});