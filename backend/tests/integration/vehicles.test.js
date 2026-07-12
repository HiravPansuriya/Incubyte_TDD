import request from 'supertest';
import app from '../../src/app.js';
import Vehicle from '../../src/models/Vehicle.js';
import User from '../../src/models/User.js';
import { connectTestDB, closeTestDB, clearTestDB } from '../dbHandler.js';

describe('Vehicles and Inventory Endpoints', () => {
    let userToken, adminToken;
    let testVehicle;

    beforeAll(async () => {
        await connectTestDB();
    });

    afterAll(async () => {
        await closeTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();

        // Seed Standard User
        const userRes = await request(app).post('/api/auth/register').send({
            email: 'user@dealership.com',
            password: 'password123',
            fullName: 'John Doe',
            role: 'user'
        });
        userToken = userRes.body.user.token;

        // Seed Admin User (Note: Register route defaults to user, but we can set role in DB manually or check if register service saves passed role)
        // Wait, does registerUser save role from req.body?
        // Let's check registerUser service:
        // const { email, password, fullName } = userData;
        // const user = await User.create({ email, password, fullName });
        // So the backend registerUser does NOT read role from userData! It defaults to 'user' because of User schema.
        // Therefore, to make a user an Admin in tests, we must find them in the database and change their role to 'admin', or create them directly using User.create!
        // Yes, creating via User.create is extremely clean and reliable!
        const adminUser = await User.create({
            email: 'admin@dealership.com',
            password: 'password123',
            fullName: 'Admin User',
            role: 'admin'
        });

        // Log in to generate a token for admin
        const adminLoginRes = await request(app).post('/api/auth/login').send({
            email: 'admin@dealership.com',
            password: 'password123'
        });
        adminToken = adminLoginRes.body.user.token;

        // Seed a default vehicle for actions
        testVehicle = await Vehicle.create({
            make: 'Tesla',
            model: 'Model 3',
            category: 'Electric',
            price: 45000,
            quantity: 3
        });
    });

    describe('POST /api/vehicles', () => {
        it('should add a new vehicle listing successfully when logged in', async () => {
            const res = await request(app)
                .post('/api/vehicles')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    make: 'Porsche',
                    model: 'Cayman',
                    category: 'Sports',
                    price: 65000,
                    quantity: 2
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.vehicle).toHaveProperty('_id');
            expect(res.body.vehicle.make).toBe('Porsche');
        });

        it('should return 401 when authorization token is missing', async () => {
            const res = await request(app)
                .post('/api/vehicles')
                .send({
                    make: 'Porsche',
                    model: 'Cayman',
                    category: 'Sports',
                    price: 65000,
                    quantity: 2
                });

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/vehicles', () => {
        it('should return a list of all vehicles', async () => {
            const res = await request(app)
                .get('/api/vehicles')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.vehicles.length).toBe(1);
            expect(res.body.vehicles[0].make).toBe('Tesla');
        });
    });

    describe('GET /api/vehicles/search', () => {
        beforeEach(async () => {
            await Vehicle.create({
                make: 'Ford',
                model: 'Mustang',
                category: 'Sports',
                price: 35000,
                quantity: 5
            });
        });

        it('should search vehicles by make, model, or category query text', async () => {
            const res = await request(app)
                .get('/api/vehicles/search?search=Mustang')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.vehicles.length).toBe(1);
            expect(res.body.vehicles[0].model).toBe('Mustang');
        });

        it('should filter vehicles by price range', async () => {
            const res = await request(app)
                .get('/api/vehicles/search?minPrice=40000&maxPrice=50000')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.vehicles.length).toBe(1);
            expect(res.body.vehicles[0].make).toBe('Tesla');
        });
    });

    describe('PUT /api/vehicles/:id', () => {
        it('should update details of an existing vehicle', async () => {
            const res = await request(app)
                .put(`/api/vehicles/${testVehicle._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ price: 43000, quantity: 4 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.vehicle.price).toBe(43000);
            expect(res.body.vehicle.quantity).toBe(4);
        });
    });

    describe('DELETE /api/vehicles/:id', () => {
        it('should allow an admin to delete a vehicle listing', async () => {
            const res = await request(app)
                .delete(`/api/vehicles/${testVehicle._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Vehicle deleted successfully');

            const count = await Vehicle.countDocuments();
            expect(count).toBe(0);
        });

        it('should deny non-admin users from deleting a vehicle', async () => {
            const res = await request(app)
                .delete(`/api/vehicles/${testVehicle._id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toBe('Not authorized as an admin');
        });
    });

    describe('POST /api/vehicles/:id/purchase', () => {
        it('should purchase a vehicle successfully and decrement quantity', async () => {
            const res = await request(app)
                .post(`/api/vehicles/${testVehicle._id}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.vehicle.quantity).toBe(2);
        });

        it('should throw an error when attempting to purchase an out-of-stock vehicle', async () => {
            // Set quantity to 0
            testVehicle.quantity = 0;
            await testVehicle.save();

            const res = await request(app)
                .post(`/api/vehicles/${testVehicle._id}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Vehicle out of stock');
        });
    });

    describe('POST /api/vehicles/:id/restock', () => {
        it('should allow an admin to restock a vehicle', async () => {
            const res = await request(app)
                .post(`/api/vehicles/${testVehicle._id}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ quantity: 5 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.vehicle.quantity).toBe(8);
        });

        it('should prevent standard users from restocking a vehicle', async () => {
            const res = await request(app)
                .post(`/api/vehicles/${testVehicle._id}/restock`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 5 });

            expect(res.statusCode).toEqual(403);
        });
    });
});
