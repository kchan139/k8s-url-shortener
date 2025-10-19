/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        '2xs': '360px',
        xs: '480px',
        sm: '640px',
        md: '760px',
        lg: '960px',
        xl: '1240px',
        '2xl': '1536px',
        '3xl': '1728px',
        '4xl': '1920px',
      },
      colors: {
        // NEUTRAL THEME
        white: '#FFFFFF',
        black: '#000000',

        // PROJECT THEME
        // Primary
        primary: '#031F67',
        'primary-300': '#3655A7',
        'primary-700': '#02123D',

        // Secondary
        secondary: '#0E619B',
        'secondary-300': '#3E9DE1',
        'secondary-700': '#093D63',

        // Tetriary
        tetriary: '#942465',
        'tetriary-300': '#DA5CA5',
        'tetriary-700': '#58153C',

        // Neutral
        neutral: '#313131',
        'neutral-300': '#6A6A6A',
        'neutral-700': '#1D1D1D',

        // Information Color
        blue: '#4285F4',

        // Success Color
        green: '#34A853',

        // Warning Color
        yellow: '#F9AB00',

        // Danger Color
        red: '#A91818',
        'red-300': '#DF9696',
        'red-700': '#660E0E',

        // HCMUT THEME
        'hcmut-light': '#1488D8',
        'hcmut-dark': '#030391',
      },
      dropShadow: {
        'secondary-1': '4px 4px 0px rgba(249, 186, 8, 1)',
        'secondary-2': '8px 8px 0px rgba(249, 186, 8, 1)',
        'secondary-4': '16px 16px 0px rgba(249, 186, 8, 1)',
      },
      keyframes: {
        'fade-in-out': {
          '0%, 2.5%, 97.5%, 100% ': { opacity: 0 },
          '10%, 90%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
