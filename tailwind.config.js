/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'custom-purple': '#49263E',
        lavender: {
          '50': '#f2e8f9',  // very light lavender
          '100': '#e5d1f3', // much lighter lavender
          '200': '#d7b9ed', // lighter lavender
          '300': '#c9a2e7', // light lavender
          '400': '#bc8be1', // light-medium lavender
          '500': '#ae74db', // medium lavender
          '600': '#652e7f', // lavender
          '700': '#582774', // slightly darker lavender
          '800': '#4b2069', // darker lavender
          '900': '#3e195e'  // much darker lavender
        },
        'golden-yellow': '#cb8f15',
        'light-gold': '#fbd687'
      },
      utilities: {
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',  /* IE and Edge */
          'scrollbar-width': 'none',  /* Firefox */
          '&::-webkit-scrollbar': {
            'display': 'none'  /* Chrome, Safari, Opera */
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        // Add more font families if needed
      },
      screens: {
        'xs': '480px', // Custom 'xs' breakpoint
        '3xl': '1750px', // Custom '3xl' breakpoint
        '4xl': '2000px', // Custom '3xl' breakpoint
        '5xl': '2400px', // Custom '3xl' breakpoint
      },
      keyframes: {
        blink1: {
          '0%': { "padding": " 5px 15px", "font-size": " 16px", "border": " 2px solid #594088", "border-radius": " 5px", "background-color": " #624d88", "color": " #f8f8f8", "cursor": " pointer", "transition": " transform 0.2s, border-color 0.2s, box-shadow 0.2s", "margin": " 10px 0", "box-shadow": " 0 2px 4px rgba(134, 111, 0, 0.658)", "font-weight": " bolder", "font-size": " 1.2rem"},
          '50%': { "padding": " 5px 15px", "font-size": " 16px", "border": " 2px solid #ffcf32", "border-radius": " 5px", "background-color": " #f4c11a", "color": " #575757", "cursor": " pointer", "transition": " transform 0.2s, border-color 0.2s, box-shadow 0.2s", "margin": " 10px 0", "box-shadow": " 0 2px 4px rgba(134, 111, 0, 0.658)", "font-weight": " bolder", "font-size": " 1.2rem"},
          '100%': { "padding": " 5px 15px", "font-size": " 16px", "border": " 2px solid #594088", "border-radius": " 5px", "background-color": " #624d88", "color": " #f8f8f8", "cursor": " pointer", "transition": " transform 0.2s, border-color 0.2s, box-shadow 0.2s", "margin": " 10px 0", "box-shadow": " 0 2px 4px rgba(134, 111, 0, 0.658)", "font-weight": " bolder", "font-size": " 1.2rem"}
        },
        blink2: {
          '0%': { "padding": " 5px 15px", "font-size": " 16px",  "color": " #f8f8f8", "cursor": " pointer", "transition": " transform 0.2s, border-color 0.2s, box-shadow 0.2s", "margin": " 10px 0", "box-shadow": " 0 2px 4px rgba(134, 111, 0, 0.658)", "font-weight": " bolder", "font-size": " 1.2rem"},
          '50%': { "padding": " 5px 15px", "font-size": " 16px",  "color": " #575757", "cursor": " pointer", "transition": " transform 0.2s, border-color 0.2s, box-shadow 0.2s", "margin": " 10px 0", "box-shadow": " 0 2px 4px rgba(134, 111, 0, 0.658)", "font-weight": " bolder", "font-size": " 1.2rem"},
          '100%': { "padding": " 5px 15px", "font-size": " 16px",  "color": " #f8f8f8", "cursor": " pointer", "transition": " transform 0.2s, border-color 0.2s, box-shadow 0.2s", "margin": " 10px 0", "box-shadow": " 0 2px 4px rgba(134, 111, 0, 0.658)", "font-weight": " bolder", "font-size": " 1.2rem"}
        }
      },
      animation: {
        'blink-slow': 'blink1 2s infinite',
        'blink-text': 'blink2 2s infinite'
      }
    },
  },
  plugins: [],
};

