/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: { brand: { 400: '#22d3ee', 500: '#06b6d4' } },
      fontFamily: {
        sans: ['var(--font-inter, system-ui)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono, monospace)', 'monospace'],
        brand: ['var(--font-manrope, system-ui)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 1px 0 rgba(255,255,255,.08) inset, 0 10px 30px -12px rgba(2,6,23,.45)'
      }
    },
  },
  plugins: [],
};
