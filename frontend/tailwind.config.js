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
        /* Premium app background: mesh-style radial layers (dark mode) */
        'mesh-dark': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56, 189, 248, 0.15), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(99, 102, 241, 0.08), transparent), radial-gradient(ellipse 50% 30% at 0% 80%, rgba(139, 92, 246, 0.06), transparent), radial-gradient(ellipse 100% 100% at 50% 50%, rgba(15, 23, 42, 0.98), transparent)',
        /* Light mode: soft depth */
        'mesh-light': 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(14, 165, 233, 0.06), transparent), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(99, 102, 241, 0.04), transparent)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        'dark-card': '0 4px 24px rgba(0,0,0,0.25)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.05)',
        'risk-glow-safe': '0 0 40px -8px rgba(16, 185, 129, 0.5)',
        'risk-glow-moderate': '0 0 40px -8px rgba(245, 158, 11, 0.5)',
        'risk-glow-dangerous': '0 0 48px -4px rgba(239, 68, 68, 0.5)',
      },
      animation: {
        'glow-slow': 'glow-pulse 8s ease-in-out infinite',
        'risk-enter': 'risk-enter 0.5s ease-out forwards',
        'risk-pulse': 'risk-pulse 2s ease-in-out infinite',
        'bar-fill': 'bar-fill 0.8s ease-out forwards',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        'risk-enter': {
          '0%': { opacity: '0', transform: 'scale(0.92) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'risk-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
          '50%': { opacity: '1', boxShadow: '0 0 24px 8px rgba(239, 68, 68, 0.25)' },
        },
        'bar-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-width, 0%)' },
        },
      },
      backdropBlur: { xs: '2px' },
      transitionDuration: { 400: '400ms' },
    },
  },
  plugins: [],
}
