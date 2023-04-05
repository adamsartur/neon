/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
module.exports = {
  content: [ 
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero": "url('/assets/start.png')",
        "background2": "url('/assets/bg2.png')",
        "background3": "url('/assets/bg3.png')",
        "background4": "url('/assets/bg4.png')",
        "hero-pattern": "url('/assets/tile.png')",
      },
      backgroundSize: {
        "hero-pattern": "520px"
      }
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '@keyframes glow': {
          from: {
            textShadow:
              '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073',
          },
          to: {
            textShadow:
              '0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4da6, 0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #ff4da6, 0 0 80px #ff4da6',
          },
        },
      };
      addUtilities(newUtilities, {
        variants: ['responsive'],
      });
    }),
  ],
}

