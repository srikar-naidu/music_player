/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hyderabad: {
          cream: '#F5E6D3',
          warm: '#E8D5B7',
          dark: '#2C1810',
          brown: '#5C3D2E',
          mutedRed: '#8B3A2A',
          terracotta: '#C67B5C',
          deepGreen: '#2D4A3E',
          warmOrange: '#D4874F',
          translucent: 'rgba(44, 24, 16, 0.55)',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
