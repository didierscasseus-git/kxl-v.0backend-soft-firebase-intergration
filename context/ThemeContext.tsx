import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
    themeHue: number;
    setThemeHue: (hue: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeHue, setThemeHue] = useState<number>(() => {
        const savedHue = localStorage.getItem('themeHue');
        return savedHue ? parseInt(savedHue, 10) : 0;
    });

    useEffect(() => {
        localStorage.setItem('themeHue', themeHue.toString());
        document.documentElement.style.setProperty('--theme-hue', themeHue.toString());
    }, [themeHue]);

    return (
        <ThemeContext.Provider value={{ themeHue, setThemeHue }}>
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

// Keep useThemeHue as an alias for backward compatibility if needed, 
// though useTheme now provides the same thing.
export const useThemeHue = useTheme;
