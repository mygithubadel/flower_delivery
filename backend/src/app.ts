import express from 'express';
import dotenv from 'dotenv';
import userRouter from './user/user';
import orderRouter from './order/order';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

export default app;