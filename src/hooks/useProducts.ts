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

interface DuplicateProductInfo {
    products: Product[];
    newProduct: Omit<Product, 'id' | 'created_at' | 'user_id'>;
}

export function useProducts(user: User | null) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [duplicateProduct, setDuplicateProduct] = useState<DuplicateProductInfo | null>(null);

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
        if (!user) return false;

        try {
            setError(null);

            // Prima controlla se esiste già un prodotto con lo stesso nome
            const { data: existingProducts } = await supabase
                .from('products')
                .select('*')
                .eq('user_id', user.id)
                .ilike('name', productData.name.trim());

            if (existingProducts && existingProducts.length > 0) {
                // Salva le informazioni sui prodotti duplicati per il modale
                setDuplicateProduct({
                    products: existingProducts,
                    newProduct: productData
                });
                return false;
            }

            // Se non esiste, procedi con l'inserimento
            const { error } = await supabase
                .from('products')
                .insert([
                    {
                        ...productData,
                        user_id: user.id,
                    },
                ]);

            if (error) throw error;
            
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

    const replaceProduct = useCallback(async (oldProductId: number, newProductData: Omit<Product, 'id' | 'created_at' | 'user_id'>) => {
        if (!user) return false;

        try {
            setError(null);
            const { error } = await supabase
                .from('products')
                .update({
                    ...newProductData,
                    user_id: user.id,
                })
                .eq('id', oldProductId);

            if (error) throw error;
            
            setDuplicateProduct(null);
            await fetchProducts();
            return true;
        } catch (err) {
            console.error('Error replacing product:', err);
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
        duplicateProduct,
        setDuplicateProduct,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        replaceProduct
    };
}
