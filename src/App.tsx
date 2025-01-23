import React, { useState } from 'react';
import { Menu, User, Table as TableIcon, LogOut } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { InstallPWA } from './components/InstallPWA';
import { useProducts } from './hooks/useProducts';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { products, loading, error, addProduct, updateProduct, deleteProduct, fetchProducts } = useProducts(user);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center fixed top-0 w-full z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 hover:bg-indigo-700 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">I tuoi Prodotti</h1>
        <button
          onClick={handleLogout}
          className="p-1 hover:bg-indigo-700 rounded-lg"
        >
          <LogOut size={24} />
        </button>
      </header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)}>
          <div className="bg-white w-64 h-full p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center space-x-3 mb-8 pt-14">
              <User size={32} className="text-indigo-600" />
              <div>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
            <nav>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100"
              >
                <TableIcon size={20} className="text-indigo-600" />
                <span>Prodotti</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 p-4">
        <div className="max-w-4xl mx-auto">
          <ProductForm 
            onAddProduct={addProduct} 
            onUpdateProduct={updateProduct}
            editingProduct={editingProduct}
            onCancelEdit={() => setEditingProduct(null)}
            products={products || []}
          />
          <ProductList 
            products={products}
            loading={loading}
            error={error}
            onDelete={deleteProduct}
            onEdit={setEditingProduct}
            onRefresh={fetchProducts}
          />
        </div>
      </main>

      <InstallPWA />
    </div>
  );
}

export default App;