import { useState, useEffect } from 'react';
import { Package, Store, Tag, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Product {
    id: number;
    name: string;
    price: number;
    store: string;
    created_at: string;
    user_id: string;
    date: string;
}

interface ProductFormProps {
    onAddProduct: (product: Omit<Product, 'id' | 'created_at' | 'user_id'>) => Promise<boolean>;
    onUpdateProduct: (id: number, product: Omit<Product, 'id' | 'created_at' | 'user_id'>) => Promise<boolean>;
    editingProduct: Product | null;
    onCancelEdit: () => void;
}

export function ProductForm({ onAddProduct, onUpdateProduct, editingProduct, onCancelEdit }: ProductFormProps) {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [store, setStore] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const { user } = useAuth();

    useEffect(() => {
        if (editingProduct) {
            setProductName(editingProduct.name);
            setPrice(editingProduct.price.toString());
            setStore(editingProduct.store);
            setDate(editingProduct.date);
        }
    }, [editingProduct]);

    const resetForm = () => {
        setProductName('');
        setPrice('');
        setStore('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const productData = {
                name: productName,
                price: parseFloat(price),
                store: store,
                date: date
            };

            let success;
            if (editingProduct) {
                success = await onUpdateProduct(editingProduct.id, productData);
                if (success) {
                    onCancelEdit();
                }
            } else {
                success = await onAddProduct(productData);
            }

            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    {editingProduct ? 'Modifica Prodotto' : 'Aggiungi Prodotto'}
                </h2>
                {editingProduct && (
                    <button
                        onClick={() => {
                            onCancelEdit();
                            resetForm();
                        }}
                        className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Annulla
                    </button>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Nome Prodotto
                        </label>
                        <div className="relative rounded-lg">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Package className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Nome del prodotto"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Prezzo
                        </label>
                        <div className="relative rounded-lg">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Tag className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Prezzo"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Negozio
                        </label>
                        <div className="relative rounded-lg">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Store className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={store}
                                onChange={(e) => setStore(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Nome del negozio"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Data
                        </label>
                        <div className="relative rounded-lg">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {editingProduct ? 'Salva Modifiche' : 'Aggiungi Prodotto'}
                    </button>
                </div>
            </form>
        </div>
    );
}
