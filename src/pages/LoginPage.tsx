import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate('/');
        }
    }, [loading, user, navigate]);

    if (loading) {
        return (
            <div style={{ 
                width: '100vw', 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    return (
        <div style={{ 
            width: '100%',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
            padding: 0
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                margin: '20px',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                <LoginFormContent />
            </div>
        </div>
    );
}

function LoginFormContent() {
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
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ 
                textAlign: 'center', 
                marginBottom: '24px'
            }}>
                <h1 style={{ 
                    fontSize: 'clamp(24px, 5vw, 28px)',
                    color: '#1a73e8',
                    marginBottom: '8px',
                    fontWeight: '500'
                }}>
                    Confronta Prezzi
                </h1>
                <p style={{ 
                    color: '#5f6368',
                    fontSize: 'clamp(14px, 4vw, 16px)',
                    margin: 0
                }}>
                    Accedi al tuo account
                </p>
            </div>

            {error && (
                <div style={{
                    background: '#fdeded',
                    border: '1px solid #f5c2c7',
                    borderRadius: '4px',
                    padding: '10px',
                    color: '#842029',
                    marginBottom: '20px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #dadce0',
                            borderRadius: '4px',
                            fontSize: 'clamp(14px, 4vw, 16px)',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #dadce0',
                            borderRadius: '4px',
                            fontSize: 'clamp(14px, 4vw, 16px)',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: '#1a73e8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: 'clamp(14px, 4vw, 16px)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        transition: 'background-color 0.2s',
                        boxSizing: 'border-box'
                    }}
                >
                    {loading ? 'Accesso in corso...' : 'Accedi'}
                </button>
            </form>
        </div>
    );
}
