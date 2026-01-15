/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#F0B90B', // Binance yellow
          600: '#d4a008',
          700: '#a17a06',
          800: '#856404',
          900: '#6b5203',
        },
        binance: {
          yellow: '#F0B90B',
          'yellow-light': '#F3BA2F',
          dark: '#1E2026',
          'dark-light': '#2B2F36',
        },
      },
    },
  },
  plugins: [],
}