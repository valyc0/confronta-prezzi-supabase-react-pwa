import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        try {
            await login(email, password);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            console.error('Login error:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="alert alert-danger py-2 mb-3" role="alert">
                    {error}
                </div>
            )}

            <div className="mb-3">
                <label htmlFor="email" className="form-label small">Email</label>
                <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control form-control-sm"
                    placeholder="Inserisci la tua email"
                    autoComplete="username"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="password" className="form-label small">Password</label>
                <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control form-control-sm"
                    placeholder="Inserisci la tua password"
                    autoComplete="current-password"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100"
            >
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Accesso in corso...
                    </>
                ) : (
                    'Accedi'
                )}
            </button>
        </form>
    );
}
