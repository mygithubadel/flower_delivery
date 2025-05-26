import {getDBConnection} from "../db";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {
    generateGetOrderQuery,
    generateGetOrdersQuery,
    generateInsertOrderQuery,
    generateUpdateOrderQuery
} from "./query";
import {AuthenticatedUser} from "../user/types";
import {DatabaseOrder, OrderRequestBody} from "./types";

export const fetchOrderById = async(orderId: number, user: AuthenticatedUser) : Promise<DatabaseOrder | null> => {
    const conn = await getDBConnection();
    return new Promise((resolve, reject) => {
        const { query, values } = generateGetOrderQuery(user, orderId);

        conn.query(query, values, (err, results: RowDataPacket[]) => {
            if (err) {
                reject(err);
            } else {
                if (results[0]) {
                    const order = results[0] as DatabaseOrder;
                    resolve(order)
                } else {
                    resolve(null)
                }
            }
        });
    })
}

export const updateOrder = async(orderId: number, order: Partial<OrderRequestBody>) : Promise<boolean> => {
    const conn = await getDBConnection();
    return new Promise((resolve, reject) => {
        const { query, values } = generateUpdateOrderQuery(orderId, order);
        conn.query(query, values, async (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        });
    })
}

export const createOrder = async(order: OrderRequestBody, user: AuthenticatedUser): Promise<DatabaseOrder> => {
    const conn = await getDBConnection();
    return new Promise((resolve, reject) => {

        const { query, values } = generateInsertOrderQuery(user, order);
        conn.query(query, values, async (err, results: ResultSetHeader) => {
            if (err) {
                reject(err);
            } else {
                const newOrderId = results.insertId;
                const order = await fetchOrderById(newOrderId, user);
                resolve(order);
            }
        });
    })

}

export const getOrders = async(user: AuthenticatedUser, statusFilter?: string): Promise<DatabaseOrder[]> => {
    const conn = await getDBConnection();
    return new Promise((resolve, reject) => {
        const { query, values } = generateGetOrdersQuery(user, statusFilter);
        conn.query(query, values, (err, results: any) => {
            if (err) {
                reject(err)
            } else {
                resolve(results);
            }
        });
    })
}