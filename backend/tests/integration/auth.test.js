import request from 'supertest';
import app from '../../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from '../dbHandler.js';

describe('Auth Endpoints', () => {
  beforeAll(async () => await connectTestDB());
  afterEach(async () => await clearTestDB());
  afterAll(async () => await closeTestDB());

  describe('Registration Flow', () => {
    it('should register a new user successfully and return a token', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'testuser@example.com',
        password: 'password123'
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body.user).toHaveProperty('token');
    });

    it('should not register a user with an existing email', async () => {
      await request(app).post('/api/auth/register').send({ email: 'dup@example.com', password: 'pass' });
      const res = await request(app).post('/api/auth/register').send({ email: 'dup@example.com', password: 'pass' });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('Login Flow', () => {
    // Seed a user into the test database before testing logins
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        email: 'login@example.com',
        password: 'securepassword'
      });
    });

    it('should login successfully and return a token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'securepassword'
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body.user).toHaveProperty('token');
    });

    it('should reject login with an incorrect password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'wrongpassword'
      });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should reject login with an unregistered email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nobody@example.com',
        password: 'securepassword'
      });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
});