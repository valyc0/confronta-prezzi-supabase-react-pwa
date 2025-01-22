import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface Product {
    id: number;
    name: string;
    price: number;
    store: string;
    created_at: string;
    user_id: string;
    date: string;
}

export function useProducts(user: User | null) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            console.error('Error fetching products:', err);
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }, [user]);

    const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'created_at' | 'user_id'>) => {
        if (!user) return;

        try {
            setError(null);
            const { error } = await supabase
                .from('products')
                .insert([
                    {
                        ...productData,
                        user_id: user.id,
                    },
                ]);

            if (error) throw error;
            
            // Fetch updated products list
            await fetchProducts();
            return true;
        } catch (err) {
            console.error('Error adding product:', err);
            if (err instanceof Error) {
                setError(err.message);
            }
            return false;
        }
    }, [user, fetchProducts]);

    const updateProduct = useCallback(async (id: number, productData: Omit<Product, 'id' | 'created_at' | 'user_id'>) => {
        if (!user) return;

        try {
            setError(null);
            const { error } = await supabase
                .from('products')
                .update({
                    ...productData,
                    user_id: user.id,
                })
                .eq('id', id);

            if (error) throw error;
            
            // Fetch updated products list
            await fetchProducts();
            return true;
        } catch (err) {
            console.error('Error updating product:', err);
            if (err instanceof Error) {
                setError(err.message);
            }
            return false;
        }
    }, [user, fetchProducts]);

    const deleteProduct = useCallback(async (id: number) => {
        if (!user) return;

        try {
            setError(null);
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            // Fetch updated products list
            await fetchProducts();
            return true;
        } catch (err) {
            console.error('Error deleting product:', err);
            if (err instanceof Error) {
                setError(err.message);
            }
            return false;
        }
    }, [user, fetchProducts]);

    return {
        products,
        loading,
        error,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct
    };
}
