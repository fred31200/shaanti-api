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
      },
      animation: {
        'spin-slow':    'spin 50s linear infinite',
        'spin-reverse': 'spin-reverse 70s linear infinite',
        'fade-in-up':   'fadeInUp 0.6s ease-out both',
        'float':        'float 6s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to:   { transform: 'rotate(0deg)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
    }
  },
  plugins: []
};
