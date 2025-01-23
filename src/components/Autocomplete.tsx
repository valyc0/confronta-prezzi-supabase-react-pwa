import { useState, useEffect, useRef } from 'react';
import { Package } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    store: string;
    date: string;
}

interface AutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (product: Product) => void;
    products: Product[];
}

export function Autocomplete({ value, onChange, onSelect, products }: AutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Filtra i suggerimenti in base al valore inserito
        if (value.trim() === '') {
            setSuggestions([]);
            return;
        }

        const filtered = products
            .filter(product => 
                product.name.toLowerCase().includes(value.toLowerCase())
            )
            // Raggruppa per nome per evitare duplicati
            .reduce((unique: Product[], item) => {
                const exists = unique.some(p => p.name.toLowerCase() === item.name.toLowerCase());
                if (!exists) {
                    unique.push(item);
                }
                return unique;
            }, [])
            .slice(0, 5); // Limita a 5 suggerimenti

        setSuggestions(filtered);
    }, [value, products]);

    useEffect(() => {
        // Chiudi i suggerimenti quando si clicca fuori
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Nome del prodotto"
                    required
                />
            </div>

            {/* Lista suggerimenti */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200">
                    {suggestions.map((product) => (
                        <button
                            key={product.id}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            onClick={() => {
                                onSelect(product);
                                setIsOpen(false);
                            }}
                        >
                            {product.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
