import  { createContext } from "react";

export interface AuthState {
    isAuthenticated: boolean;
    role: string;
    email: string | null;
    userId: string | null;
}

interface AuthContextValue extends AuthState {
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
    isAuthenticated: false,
    role: "",
    email: null,
    userId: null,
    login: () => { },
    logout: () => { },
});


