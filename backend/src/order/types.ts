type OrderStatus = 'pending' | 'delivered' | 'canceled';

export interface OrderRequestBody {
    status: OrderStatus;
    flower_details: Record<string, any>;
    quantity: number;
    address: string;
}

export interface DatabaseOrder {
    id: number;
    user_id: number;
    status: OrderStatus;
    flower_details: any;
    quantity: number;
    address: string;
    created_at: string;
    updated_at: string;
}