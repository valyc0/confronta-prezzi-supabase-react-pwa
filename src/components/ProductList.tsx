import { useEffect, useState } from 'react';
import { Search, DollarSign, Trash2, Store as StoreIcon, Edit2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { Modal } from './Modal';

interface Product {
    id: number;
    name: string;
    price: number;
    store: string;
    created_at: string;
    user_id: string;
    date: string;
}

interface ProductListProps {
    products: Product[];
    loading: boolean;
    error: string | null;
    onDelete: (id: number) => Promise<void>;
    onEdit: (product: Product) => void;
    onRefresh: () => Promise<void>;
}

export function ProductList({ products, loading, error, onDelete, onEdit, onRefresh }: ProductListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    useEffect(() => {
        onRefresh();
    }, [onRefresh]);

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (productToDelete) {
            await onDelete(productToDelete.id);
            setProductToDelete(null);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.store.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriceMin = priceMin === '' || product.price >= parseFloat(priceMin);
        const matchesPriceMax = priceMax === '' || product.price <= parseFloat(priceMax);
        return matchesSearch && matchesPriceMin && matchesPriceMax;
    });

    return (
        <>
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Conferma Eliminazione"
            >
                {productToDelete ? (
                    <p>
                        Sei sicuro di voler eliminare il prodotto "{productToDelete.name}" acquistato da {productToDelete.store}?
                        Questa azione non può essere annullata.
                    </p>
                ) : (
                    <p>Sei sicuro di voler eliminare questo prodotto?</p>
                )}
            </Modal>

            <div className="bg-white rounded-xl shadow-sm mt-6">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Lista Prodotti</h2>
                        <button
                            onClick={() => onRefresh()}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Aggiorna
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Cerca per nome o negozio"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Prezzo minimo"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                                step="0.01"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Prezzo massimo"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="text-center py-10 text-gray-500">
                                Caricamento prodotti...
                            </div>
                        ) : error ? (
                            <div className="text-center py-10 text-red-500">
                                Errore nel caricamento dei prodotti: {error}
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Prodotto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Negozio
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Prezzo
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Azioni
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    <StoreIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                    {product.store}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                                €{product.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                                {new Date(product.created_at).toLocaleDateString('it-IT')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => onEdit(product)}
                                                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-100 transition-colors"
                                                        title="Modifica"
                                                    >
                                                        <Edit2 className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(product)}
                                                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Elimina"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {filteredProducts.length === 0 && (
                                    <tfoot>
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                                Nessun prodotto trovato
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
