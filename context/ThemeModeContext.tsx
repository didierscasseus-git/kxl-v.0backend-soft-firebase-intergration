import { createContext, useContext, useEffect, useState } from "react";

interface ThemeModeContextType {
    mode: "dark" | "light";
    toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<"dark" | "light">(
        (localStorage.getItem("kxl-theme") as "dark" | "light") || "dark"
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", mode === "dark");
        localStorage.setItem("kxl-theme", mode);
    }, [mode]);

    const toggleMode = () =>
        setMode((m) => (m === "dark" ? "light" : "dark"));

    return (
        <ThemeModeContext.Provider value={{ mode, toggleMode }}>
            {children}
        </ThemeModeContext.Provider>
    );
}

export const useThemeMode = () => {
    const context = useContext(ThemeModeContext);
    if (context === undefined) {
        throw new Error("useThemeMode must be used within a ThemeModeProvider");
    }
    return context;
};
