import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProductForm } from '../components/ProductForm';
import { ProductList } from '../components/ProductList';

export function HomePage() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [loading, user, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Caricamento...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container-fluid">
                    <span className="navbar-brand fw-bold text-primary">Confrontaaaa Prezzi</span>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="container py-4">
                <div className="row">
                    <div className="col-12 col-lg-8 mx-auto">
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Aggiungi Prodottoaaaa</h5>
                                <ProductForm />
                            </div>
                        </div>

                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Lista Prodotti</h5>
                                <ProductList />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
