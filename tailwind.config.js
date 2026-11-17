/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          darkest: '#05070e',
          dark: '#090e1a',
          surface: '#0f172a',
          card: '#131d33',
          cardHover: '#182542',
          border: '#1e293b',
          borderGlow: '#0284c7',
        },
        electric: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          400: '#38bdf8',
          500: '#0ea5e9',
          neon: '#00f0ff',
          blue: '#2563eb',
        },
        burgundy: {
          900: '#4c0519',
          800: '#881337',
          700: '#9f1239',
          600: '#be123c',
          500: '#e11d48',
          neon: '#ff0055',
        },
        warning: {
          neon: '#ffb703',
        },
        safety: {
          neon: '#00f59b',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.35)',
        'glow-burgundy': '0 0 25px -5px rgba(225, 29, 72, 0.4)',
        'glow-cyan-sm': '0 0 12px rgba(0, 240, 255, 0.25)',
        'glow-burgundy-sm': '0 0 12px rgba(225, 29, 72, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'scan': 'scan 4s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'radar': 'radar 8s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
