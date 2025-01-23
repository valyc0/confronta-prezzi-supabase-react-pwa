import { useState, useEffect } from 'react';
import { Store, Tag, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Autocomplete } from './Autocomplete';

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
    products: Product[];
}

export function ProductForm({ 
    onAddProduct, 
    onUpdateProduct,
    editingProduct, 
    onCancelEdit,
    products
}: ProductFormProps) {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [store, setStore] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [existingProducts, setExistingProducts] = useState<Product[]>([]);
    const [showFields, setShowFields] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (editingProduct) {
            setProductName(editingProduct.name);
            setPrice(editingProduct.price.toString());
            setStore(editingProduct.store);
            setDate(editingProduct.date);
            setShowFields(true);
        }
    }, [editingProduct]);

    const resetForm = () => {
        setProductName('');
        setPrice('');
        setStore('');
        setDate(new Date().toISOString().split('T')[0]);
        setExistingProducts([]);
        setShowFields(false);
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
            // Se esiste già un prodotto con lo stesso nome e negozio, lo aggiorniamo
            const existingProduct = existingProducts.find(p => 
                p.store.toLowerCase() === store.toLowerCase()
            );

            if (existingProduct) {
                success = await onUpdateProduct(existingProduct.id, productData);
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

    const handleProductSelect = (product: Product) => {
        setProductName(product.name);
        setPrice(product.price.toString());
        setStore(product.store);
        setDate(product.date);
        setShowFields(true);
        
        // Trova tutti i prodotti con lo stesso nome
        const sameProducts = products.filter(p => 
            p.name.toLowerCase() === product.name.toLowerCase()
        );

        setExistingProducts(sameProducts);
    };

    const handleProductChange = (value: string) => {
        setProductName(value);
        if (value.trim() === '') {
            setShowFields(false);
            setExistingProducts([]);
            setPrice('');
            setStore('');
            setDate(new Date().toISOString().split('T')[0]);
        } else {
            setShowFields(true);
            // Cerca se esiste un prodotto con lo stesso nome
            const sameProducts = products.filter(p => 
                p.name.toLowerCase() === value.toLowerCase()
            );
            
            if (sameProducts.length > 0) {
                // Usa i dati del prodotto più recente
                const latestProduct = sameProducts.reduce((latest, current) => {
                    return new Date(current.date) > new Date(latest.date) ? current : latest;
                });
                setPrice(latestProduct.price.toString());
                setStore(latestProduct.store);
                setDate(latestProduct.date);
                setExistingProducts(sameProducts);
            }
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
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome Prodotto
                        </label>
                        <Autocomplete
                            value={productName}
                            onChange={handleProductChange}
                            onSelect={handleProductSelect}
                            products={products}
                        />
                    </div>

                    {showFields && (
                        <>
                            {existingProducts.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-start">
                                        <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-2" />
                                        <div>
                                            <p className="text-sm text-blue-700 font-medium mb-2">
                                                Prodotto esistente! Modifica i dati per aggiornare.
                                            </p>
                                            <ul className="space-y-1">
                                                {existingProducts.map(p => (
                                                    <li key={p.id} className="text-sm text-blue-600">
                                                        {p.store}: {p.price}€ ({new Date(p.date).toLocaleDateString()})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}
