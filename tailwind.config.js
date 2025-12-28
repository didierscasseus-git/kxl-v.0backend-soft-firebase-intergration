/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./sections/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class', // Enable dark mode manually if needed, or stick to media
    theme: {
        extend: {
            colors: {
                // We can extend the theme based on the Soft Tonal Neon variables here if we want strict typing, 
                // but for now relying on CSS variables in index.css is fine.
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Verify if this is desired
            }
        },
    },
    plugins: [],
}
