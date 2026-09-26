/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        medical: {
          safe:      '#059669',
          moderate:  '#d97706',
          dangerous: '#dc2626',
          primary:   '#0891B2',
          'primary-dark': '#0e7490',
          'primary-light': '#e0f2fe',
          secondary: '#22D3EE',
          accent:    '#059669',
        },
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0e7490 0%, #0891B2 45%, #0369a1 100%)',
        'gradient-safe': 'linear-gradient(135deg, #059669, #10b981)',
        'gradient-moderate': 'linear-gradient(135deg, #d97706, #f59e0b)',
        'gradient-dangerous': 'linear-gradient(135deg, #dc2626, #ef4444)',
      },
      boxShadow: {
        'card':     '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 6px -1px rgb(0 0 0 / 0.06)',
        'card-lg':  '0 8px 24px -4px rgb(0 0 0 / 0.10), 0 4px 10px -2px rgb(0 0 0 / 0.07)',
        'primary':  '0 4px 14px rgba(8,145,178,0.35)',
        'safe-glow':      '0 0 24px -4px rgba(5,150,105,0.4)',
        'moderate-glow':  '0 0 24px -4px rgba(217,119,6,0.4)',
        'dangerous-glow': '0 0 32px -4px rgba(220,38,38,0.45)',
        'inner-sm': 'inset 0 1px 3px rgb(0 0 0 / 0.06)',
      },
      animation: {
        'fade-up':    'fade-up 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':    'fade-in 0.25s cubic-bezier(0.16,1,0.3,1) both',
        'risk-enter': 'fade-up 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'chat-up':    'chat-slide-up 0.25s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
        'skeleton':   'skeleton-shimmer 1.4s ease infinite',
        'dot-1':      'dots-bounce 1.2s ease-in-out 0s infinite',
        'dot-2':      'dots-bounce 1.2s ease-in-out 0.2s infinite',
        'dot-3':      'dots-bounce 1.2s ease-in-out 0.4s infinite',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'chat-slide-up': {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pulse-ring': {
          '0%':   { boxShadow: '0 0 0 0 rgba(220,38,38,0.35)' },
          '70%':  { boxShadow: '0 0 0 12px rgba(220,38,38,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(220,38,38,0)' },
        },
        'skeleton-shimmer': {
          '0%':   { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'dots-bounce': {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%':            { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
