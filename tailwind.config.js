/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        craft: {
          yarn: '#f97316',
          thread: '#8b5cf6',
          fabric: '#ec4899',
        },
      },
      animation: {
        'ping-once': 'ping 1s cubic-bezier(0, 0, 0.2, 1) 1',
      },
    },
  },
  plugins: [],
};