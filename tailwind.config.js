/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}"
  ],
   theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-shadow': 'pulseShadow 2s infinite ease-in-out',
        'pulse-text': 'pulseText 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseShadow: {
          '0%, 100%': {
            boxShadow: '0 0 30px rgba(0,0,0,0.5), 0 0 60px rgba(255,255,255,0.1)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 80px rgba(255,255,255,0.2)',
          },
        },
        pulseText: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

