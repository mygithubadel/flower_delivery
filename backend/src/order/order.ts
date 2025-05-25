import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../auth';
import {orderSchema, orderUpdateSchema} from "./schema";
import {OrderRequestBody} from "./types";
import {createOrder, fetchOrderById, getOrders, updateOrder} from "./service";
import {AuthenticatedUser} from "../user/types";

const router = Router();

// CREATE
router.post('/', authenticateJWT, async (req: Request<{}, {}, OrderRequestBody>, res: Response) => {
    const { error } = orderSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    const user = (req as any).user;

    try{
        const order = await createOrder(req.body, user)
        res.status(201).json({ message: 'Order created', order });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create order' });
        return;
    }

});

// UPDATE
router.put('/:id', authenticateJWT, async (req: Request<{ id: string }, {}, Partial<OrderRequestBody>>, res: Response) => {
    const { error } = orderUpdateSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    const orderId = parseInt(req.params.id);
    const user = (req as any).user as AuthenticatedUser;

    try {
        const order = await fetchOrderById(orderId, user);
        if (order === null) {
            res.status(404).json({ error: 'Order not found or unauthorized' });
            return;
        }

        const isUpdated = updateOrder(orderId, req.body);

        if (isUpdated) {
            const order = await fetchOrderById(orderId, user);
            res.json({ message: 'Order updated', order });
        }

    } catch(err){
        res.status(500).json({ error: 'Database error' });
        return
    }

});

// GET
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
    const user = (req as any).user as AuthenticatedUser;
    const statusFilter = req.query.status as string | undefined;

    try{
        const orders = await getOrders(user, statusFilter);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }

});

export default router;
