import {OrderRequestBody} from "./types";
import {AuthenticatedUser} from "../user/types";

interface QueryParts { query: string; values: any[] }

export function generateUpdateOrderQuery(
    orderId: number,
    fieldsToUpdate: Partial<OrderRequestBody>,
): QueryParts {
    const fields: string[] = [];
    const values: any[] = [];

    if (fieldsToUpdate.status !== undefined) {
        fields.push('status = ?');
        values.push(fieldsToUpdate.status);
    }

    if (fieldsToUpdate.flower_details !== undefined) {
        fields.push('flower_details = ?');
        values.push(JSON.stringify(fieldsToUpdate.flower_details));
    }

    if (fieldsToUpdate.quantity !== undefined) {
        fields.push('quantity = ?');
        values.push(fieldsToUpdate.quantity);
    }

    if (fieldsToUpdate.address !== undefined) {
        fields.push('address = ?');
        values.push(fieldsToUpdate.address);
    }

    if (fields.length === 0) {
        throw new Error('No fields to update');
    }

    const query = `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`;
    values.push(orderId);

    return { query, values };
}

export function generateInsertOrderQuery(user: AuthenticatedUser, order: OrderRequestBody): QueryParts {
    const query = `
    INSERT INTO orders (user_id, status, flower_details, quantity, address)
    VALUES (?, ?, ?, ?, ?)
  `;

    const values = [
        user.id,
        order.status,
        JSON.stringify(order.flower_details),
        order.quantity,
        order.address
    ];

    return { query, values };
}

export function generateGetOrdersQuery(user: AuthenticatedUser, statusFilter?: string): QueryParts {
    if (statusFilter) {
        return {
            query: 'SELECT * FROM orders WHERE user_id = ? AND status = ? ORDER BY created_at DESC',
            values: [user.id, statusFilter]
        };
    } else {
        return {
            query: 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            values: [user.id]
        };
    }
}

export function generateGetOrderQuery(user: AuthenticatedUser, orderId: number): QueryParts {
   return {
       query: 'SELECT * FROM orders WHERE id = ? AND user_id = ?',
       values: [orderId, user.id]
   }

}