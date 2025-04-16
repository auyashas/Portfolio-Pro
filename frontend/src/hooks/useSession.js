// src/hooks/useSession.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSession = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await axios.get('http://localhost:3000/check-session', { withCredentials: true });
                if (res.data.isLoggedIn) {
                    setUser({ role: res.data.role });
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Session check failed:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, []);

    const logout = async () => {
        // You can clear the cookie from backend if needed
        document.cookie = "user_session=; Max-Age=0; path=/;"; // optional: clear manually
        setUser(null);
    };

    return { user, loading, logout };
};
