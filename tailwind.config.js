/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          '50': '#FEF1EA',
          '100': '#FED7C0',
          '200': '#FEBC96',
          '300': '#FEA16C',
          '400': '#FE8742',
          '500': '#FE7A2D',
          '600': '#CB6124',
          '700': '#98491B',
          '800': '#653012',
          '900': '#4C240D',
          '950': '#321809'
        }
      }
    },
  },
  darkMode: ['selector', '[class~="my-app-dark"]'],
  plugins: [PrimeUI],
}

