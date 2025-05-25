import request from 'supertest';
import http from 'http';
import app from '../src/app';
import {getDBConnection} from '../src/db';

const server = http.createServer(app);

describe('User and Order API', () => {
    const testUsername = `testuser_${Date.now()}`;
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'password123';
    const testPhone = '+40712345678';

    let token: string;
    let orderId: number;

    describe('User authentication', () => {

        it('should return 401 Unauthorized when accessing orders without a token', async () => {
            const res = await request(server)
                .get('/api/orders');

            expect(res.statusCode).toBe(401);
        });

        it('should register a new user', async () => {
            const res = await request(server)
                .post('/api/users/register')
                .send({username: testUsername, email: testEmail, password: testPassword, phone: testPhone});

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'User registered');
            expect(res.body).toHaveProperty('userId');
        });

        it('should login user and get JWT token', async () => {
            const res = await request(server)
                .post('/api/users/login')
                .send({username: testUsername, password: testPassword});

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            token = res.body.token;
        });


        it('should return 409 conflict if username or email already exists', async () => {

            const res1 = await request(server)
                .post('/api/users/register')
                .send({username: testUsername, email: 'another@email.com', password: testPassword, phone: testPhone});

            expect(res1.statusCode).toBe(409);
            expect(res1.body).toHaveProperty('error', 'Username or email already exists');

            const res2 = await request(server)
                .post('/api/users/register')
                .send({username: 'anotherUserName', email: testEmail, password: testPassword, phone: testPhone});

            expect(res2.statusCode).toBe(409);
            expect(res2.body).toHaveProperty('error', 'Username or email already exists');

        });


    });

    describe('Order create / update / fetch', () => {

        it('should create a new order and return the created order', async () => {
            const newOrder = {
                status: 'pending',
                flower_details: {type: 'roses', color: 'red'},
                quantity: 10,
                address: 'Strada Unirii, Nr. 2',
            };

            const res = await request(server)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(newOrder);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Order created');
            expect(res.body).toHaveProperty('order');
            expect(res.body.order).toMatchObject(newOrder);

            orderId = res.body.order.id;
        });

        it('should fetch the order for the user', async () => {
            const res = await request(server)
                .get('/api/orders')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some((order: any) => order.id === orderId)).toBe(true);
        });

        it('should update all of the order fields and return the updated order', async () => {
            const updatedFields = {
                status: 'delivered',
                flower_details: {type: 'roses', color: 'white'},
                quantity: 5,
                address: 'Strada Unirii, Nr. 2',
            };

            const res = await request(server)
                .put(`/api/orders/${orderId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedFields);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Order updated');
            expect(res.body).toHaveProperty('order');
            expect(res.body.order).toMatchObject(updatedFields);
        });

        it('should partially update the order and return the updated order', async () => {
            const partialUpdate = {
                quantity: 7,
                address: 'Strada Unirii, Nr. 1',
            };

            const res = await request(server)
                .put(`/api/orders/${orderId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(partialUpdate);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Order updated');
            expect(res.body).toHaveProperty('order');
            expect(res.body.order.quantity).toBe(partialUpdate.quantity);
            expect(res.body.order.address).toBe(partialUpdate.address);
        });

        it('should fetch orders filtered by status', async () => {
            const res = await request(server)
                .get('/api/orders')
                .query({status: 'delivered'})
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.every((order: any) => order.status === 'delivered')).toBe(true);
        });

        it('should create another order and fetch it along the previously created order', async () => {
            const newOrder = {
                status: 'pending',
                flower_details: {type: 'roses', color: 'red'},
                quantity: 5,
                address: 'Strada Unirii, Nr. 13',
            };

            const res = await request(server)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(newOrder);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', 'Order created');
            expect(res.body).toHaveProperty('order');
            expect(res.body.order).toMatchObject(newOrder);

            orderId = res.body.order.id;

            const res2 = await request(server)
                .get('/api/orders')
                .set('Authorization', `Bearer ${token}`);

            expect(res2.statusCode).toBe(200);
            expect(Array.isArray(res2.body)).toBe(true);
            expect(res2.body.length).toBe(2);
        });

        it('should reject updating an order not owned by the user', async () => {
            const anotherUsername = `otheruser_${Date.now()}`;
            const anotherEmail = `other${Date.now()}@example.com`;
            const anotherPassword = 'anotherpassword123';
            const anotherPhone = '+40798765432';

            const registerRes = await request(server)
                .post('/api/users/register')
                .send({username: anotherUsername, email: anotherEmail, password: anotherPassword, phone: anotherPhone});

            expect(registerRes.statusCode).toBe(201);

            const loginRes = await request(server)
                .post('/api/users/login')
                .send({username: anotherUsername, password: anotherPassword});

            expect(loginRes.statusCode).toBe(200);
            const otherUserToken = loginRes.body.token;

            const createOrderRes = await request(server)
                .post('/api/orders')
                .set('Authorization', `Bearer ${otherUserToken}`)
                .send({
                    status: 'pending',
                    flower_details: {type: 'tulips', color: 'yellow'},
                    quantity: 3,
                    address: 'another address 1',
                });

            expect(createOrderRes.statusCode).toBe(201);
            const otherOrderId = createOrderRes.body.order.id;

            const updateAttemptRes = await request(server)
                .put(`/api/orders/${otherOrderId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({quantity: 10});

            expect(updateAttemptRes.statusCode).toBe(404);
            expect(updateAttemptRes.body).toHaveProperty('error');
        });

    });


    describe('Order validation schema', () => {
        it('should return 400 when creating order with missing required fields', async () => {
            const invalidOrder = {
                // missing: status, flower_details, quantity, address
            };

            const res = await request(server)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(invalidOrder);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 when creating order with invalid values', async () => {
            const invalidOrder = {
                status: 'invalid_status',
                flower_details: 'not_an_object',
                quantity: 0, // less than min
                address: 'a' // too short
            };

            const res = await request(server)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(invalidOrder);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 when updating order with no fields provided', async () => {
            const res = await request(server)
                .put(`/api/orders/${orderId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({}); // empty object, should trigger .min(1) on update schema

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 when updating order with invalid field types', async () => {
            const res = await request(server)
                .put(`/api/orders/${orderId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    quantity: -5,
                    status: 'not_valid_status',
                    address: 'a',
                    flower_details: 'string_instead_of_object'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('User validation schema', () => {
        it('should return 400 when registering with missing fields', async () => {
            const res = await request(server)
                .post('/api/users/register')
                .send({}); // empty

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 when registering with invalid email, password, phone, or username', async () => {
            const res = await request(server)
                .post('/api/users/register')
                .send({
                    email: 'invalid_email',
                    username: 'abc', // too short
                    password: '123', // too short
                    phone: '123456789' // invalid format
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toMatch(/email|username|password|phone/i);
        });

        it('should return 400 when logging in with missing fields', async () => {
            const res = await request(server)
                .post('/api/users/login')
                .send({}); // empty

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 when logging in with invalid username or password', async () => {
            const res = await request(server)
                .post('/api/users/login')
                .send({
                    username: 'ab', // too short
                    password: '123' // too short
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });


});

const resetTestedTables = async () => {
    const conn = await getDBConnection();
    return new Promise<void>((resolve, reject) => {
        conn.query('DELETE FROM orders', err => {
            if (err) return reject(err);
            conn.query('DELETE FROM users', err2 => {
                if (err2) return reject(err2);
                resolve();
            });
        });
    });
}

afterAll(async () => {
    const conn = await getDBConnection();

    try {
        await resetTestedTables()
    } catch (err) {
        console.error('Failed to clean up tables:', err);
    } finally {
        conn.end();
    }
});
