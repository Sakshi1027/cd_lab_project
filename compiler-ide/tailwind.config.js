/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base':      '#050814',
        'bg-glass':     'rgba(17, 24, 39, 0.45)',
        'bg-secondary': '#111827',
        'bg-tertiary':  '#1a2236',
        'bg-border':    'rgba(31, 47, 74, 0.5)',
        'accent-purple':'#8b5cf6',
        'accent-green': '#22C55E',
        'accent-amber': '#F59E0B',
        'accent-red':   '#EF4444',
        'accent-cyan':  '#22d3ee',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow':  'spin-slow 1.5s linear infinite',
        'fade-in-up': 'fade-in-up 0.3s ease-out both',
        'blink':      'blink 1.2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(124,58,237,0.35)', opacity: '1' },
          '50%':       { boxShadow: '0 0 12px 4px rgba(124,58,237,0.35)', opacity: '0.8' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
}
