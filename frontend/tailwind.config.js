/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        medical: {
          safe: '#10b981',
          moderate: '#f59e0b',
          dangerous: '#ef4444',
          primary: '#0ea5e9',
          dark: '#0f172a',
        },
      },
      backgroundImage: {
        'gradient-medical': 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        'dark-card': '0 4px 24px rgba(0,0,0,0.25)',
      },
      backdropBlur: { xs: '2px' },
      transitionDuration: { 400: '400ms' },
    },
  },
  plugins: [],
}
