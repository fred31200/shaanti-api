/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        shaanti: {
          50:  '#FDFAF5',
          100: '#F7F0E6',
          200: '#EDE0CC',
          300: '#DCC5A8',
          400: '#C4A07A',
          500: '#A67C52',
          600: '#8B6340',
          700: '#6F4E32',
          800: '#503828',
          900: '#3D2B1F',
        },
        cream: '#FDFAF5',
      },
      fontFamily: {
        sans: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundColor: {
        page: '#FDFAF5',
      }
    }
  },
  plugins: []
};
