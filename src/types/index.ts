export interface Product {
    id: number;
    name: string;
    store: string;
    price: number;
    date: string;
    created_at: string;
    updated_at: string;
    user_id: string;
}

export interface Store {
    name: string;
    count: number;
}
