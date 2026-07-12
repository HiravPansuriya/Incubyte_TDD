import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';

describe('Auth Endpoints', () => {

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });
});