/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF6E9',
          100: '#F7ECC8',
          200: '#F0D98A',
          300: '#E9C555',
          400: '#D4AF37',
          500: '#C5A028',
          600: '#A8861F',
          700: '#8A6F18',
          800: '#6B5612',
          900: '#4A3C0D',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
