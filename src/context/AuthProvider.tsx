import { useState } from "react";
import { AuthContext, type AuthState } from "./AuthContext";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    userId: string;
    email: string;
    role: string;
    exp: number;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const parseToken = (token: string | null): AuthState => {
        if (!token) {
            return { isAuthenticated: false, role: "", email: null, userId: null };
        }
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            return {
                isAuthenticated: true,
                role: decoded.role,
                email: decoded.email,
                userId: decoded.userId,
            };
        } catch {
            return { isAuthenticated: false, role: "", email: null, userId: null };
        }
    };

    const [state, setState] = useState<AuthState>(() => {
        const token = localStorage.getItem("jwtToken");
        return parseToken(token);
    });

    const login = (token: string) => {
        localStorage.setItem("jwtToken", token);
        setState(parseToken(token));
    };

    const logout = () => {
        localStorage.removeItem("jwtToken");
        setState({ isAuthenticated: false, role: "", email: null, userId: null });
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};