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
        gs: {
          red: {
            DEFAULT: '#E52320',
            dark: '#B81715',
            light: '#FF4D4A',
            glow: 'rgba(229, 35, 32, 0.25)'
          },
          green: {
            DEFAULT: '#0D8A43',
            dark: '#08632F',
            light: '#14B858'
          },
          dark: {
            bg: '#0F172A',
            card: '#1E293B',
            border: '#334155',
            hover: '#334155'
          }
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(229, 35, 32, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(229, 35, 32, 0.8)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
