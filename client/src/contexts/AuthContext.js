import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
            try {
                const parsedAuth = JSON.parse(storedAuth);
                setAuth(parsedAuth);
            } catch (error) {
                console.error("Failed to parse auth", error);
                localStorage.removeItem('auth');
            }
        }
    }, []);

    const login = (userData, token) => {
        if (!userData || !userData.role) {
            console.error("Login failed: User role is missing");
            return;
        }

        const authData = { user: userData, token };
        setAuth(authData);
        localStorage.setItem('auth', JSON.stringify(authData));
    };

    const logout = () => {
        setAuth(null);
        localStorage.removeItem('auth');
    };

    const value = {
        auth,
        login,
        logout,
        isAuthenticated: !!auth?.token,
        token: auth?.token,
        user: auth?.user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
