export interface Product {
    id: string;
    name: string;
    price: number;
    store: Store;
    created_at: string;
    user_id: string;
}

export interface Store {
    id: string;
    name: string;
}
