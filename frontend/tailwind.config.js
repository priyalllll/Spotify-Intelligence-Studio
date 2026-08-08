/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: "#1DB954",
          hover: "#1ED760",
          black: "#121212",
          surface: "#181818",
          card: "#242424",
          cardHover: "#2A2A2A",
          muted: "#B3B3B3",
          subtle: "#727272",
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        '2xl': '16px',
      },
      boxShadow: {
        'spotify-glow': '0 8px 32px rgba(29, 185, 84, 0.25)',
        'card-glow': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
