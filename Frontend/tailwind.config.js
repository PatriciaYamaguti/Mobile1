/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de cores do app
        primary: {
          50: '#e8edf9',
          100: '#c7d3f5',
          500: '#1A3A8F',
          600: '#152e72',
          700: '#0f2255',
        },
        accent: {
          400: '#F5B84C',
          500: '#E8920A',
          600: '#C47A08',
        },
      },
    },
  },
  plugins: [],
}
