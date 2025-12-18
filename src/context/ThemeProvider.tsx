import React, { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const [theme, setTheme] = useState<Theme>(stored || "light");

    const toggleTheme = () => {
        const updated = theme === "light" ? "dark" : "light";
        setTheme(updated);
        localStorage.setItem("theme", updated);
    };

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark-mode");
        } else {
            root.classList.remove("dark-mode");
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
