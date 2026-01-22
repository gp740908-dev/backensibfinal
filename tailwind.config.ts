import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                admin: {
                    bg: '#F2F0E9',      // Soft Clay Background
                    surface: '#FFFFFF',  // Cards / Panels
                    forest: '#152C22',   // Primary Text / Sidebar
                    gold: '#C8B27C',     // Accents
                    sand: '#E6E4DD',     // Secondary Backgrounds
                    danger: '#9B2C2C',
                    success: '#276749',
                }
            },
            fontFamily: {
                serif: ['var(--font-playfair)', 'serif'],
                sans: ['var(--font-manrope)', 'sans-serif'],
                mono: ['var(--font-jetbrains)', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'slide-up': 'slideUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            }
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
export default config;
