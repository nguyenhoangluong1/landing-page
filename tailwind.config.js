/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        champagne: {
          50: '#fdfbf7',
          100: '#f7f0e4',
          200: '#f0e0c4',
          300: '#e6cb9a',
          400: '#d9b26e',
          500: '#cc9a4a',
          600: '#b6803e',
          700: '#966635',
          800: '#7a5331',
          900: '#63462a',
        },
        sage: {
          50: '#f6f7f4',
          100: '#eaefe5',
          200: '#d6dfcd',
          300: '#b8c8aa',
          400: '#98ae82',
          500: '#7b9563',
          600: '#60764b',
          700: '#4c5d3c',
          800: '#3f4d33',
          900: '#36402c',
        },
        cream: {
          50: '#fefefe',
          100: '#fdfcfc',
          200: '#fbf7f5',
          300: '#f7f0eb',
          400: '#f1e6dc',
          500: '#e8d5c4',
          600: '#dcc1a7',
          700: '#caa887',
          800: '#b8956e',
          900: '#a6845c',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'luxury': '0 4px 25px 0 rgba(0, 0, 0, 0.1)',
        'luxury-lg': '0 10px 50px 0 rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}