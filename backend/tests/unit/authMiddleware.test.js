// backend/tests/unit/authMiddleware.test.js
import { protect, admin } from '../../src/middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';
import User from '../../src/models/User.js';
import { jest } from '@jest/globals'; // Explicitly import jest for ES Modules

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        
        // Clear mocks before each test to ensure a clean slate
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Restore spied functions back to their original state
        jest.restoreAllMocks();
    });

    describe('protect middleware', () => {
        it('should call next() if valid token is provided', async () => {
            req.headers.authorization = 'Bearer validtoken123';
            
            // Use spyOn instead of jest.mock()
            jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'user123' });
            
            // Mocking the chained .select() method for Mongoose
            const mockSelect = jest.fn().mockResolvedValue({ _id: 'user123', role: 'user' });
            jest.spyOn(User, 'findById').mockReturnValue({ select: mockSelect });

            await protect(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(req.user._id).toBe('user123');
        });

        it('should return 401 if no token is provided', async () => {
            await protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
        });

        it('should return 401 if token is invalid', async () => {
            req.headers.authorization = 'Bearer invalidtoken';
            
            jest.spyOn(jwt, 'verify').mockImplementation(() => { 
                throw new Error('Invalid token'); 
            });

            await protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
        });
    });

    describe('admin middleware', () => {
        it('should call next() if user is an admin', () => {
            req.user = { role: 'admin' };
            admin(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
        });

        it('should return 403 if user is not an admin', () => {
            req.user = { role: 'user' };
            admin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized as an admin' });
        });
    });
});