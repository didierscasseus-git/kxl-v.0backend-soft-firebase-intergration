import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    themeHue: number;
    setThemeHue: (hue: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    });

    const [themeHue, setThemeHue] = useState<number>(() => {
        const savedHue = localStorage.getItem('themeHue');
        return savedHue ? parseInt(savedHue, 10) : 0;
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('themeHue', themeHue.toString());
        document.documentElement.style.setProperty('--theme-hue', themeHue.toString());
    }, [themeHue]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, themeHue, setThemeHue }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeHue = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeHue must be used within a ThemeProvider');
    }
    return context;
};
