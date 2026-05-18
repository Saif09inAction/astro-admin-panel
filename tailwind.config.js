/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'gold': { 400: '#fbbf24', 500: '#f59e0b' },
        'navy': { 800: '#1e293b', 900: '#0f172a', 950: '#030712' },
      },
    },
  },
  plugins: [],
}
