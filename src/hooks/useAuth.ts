import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check active sessions and sets the user
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                setUser(session?.user ?? null);
            } catch (err) {
                if (err instanceof Error) {
                    console.error('Error getting session:', err.message);
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('Auth state changed:', _event, session?.user?.email);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            
            setUser(data.user);
            return data;
        } catch (err) {
            if (err instanceof Error) {
                console.error('Login error:', err.message);
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Sign out from Supabase
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            // Force clear the user state
            setUser(null);
            
            console.log('Logout successful');
        } catch (err) {
            if (err instanceof Error) {
                console.error('Logout error:', err.message);
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        login,
        logout
    };
}
