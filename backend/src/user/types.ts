
export interface RegisterRequestBody {
    email: string;
    password: string;
    username: string;
    phone: string;
}

export interface LoginRequestBody {
    username: string;
    password: string;
}

export interface AuthenticatedUser {
    id: number;
    username: string;
}

export interface DatabaseUser {
    email: string;
    password: string; // hashed
    username: string;
    phone: string;
    id: number;
    invited_by?: number
}