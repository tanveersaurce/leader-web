/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#FF6B00',
          dark: '#D95B00',
          light: '#FF8533',
        },
        cream: '#F5F0EB',
        charcoal: '#1A1A1A',
        lightgrey: '#F0F0F0',
      },
      fontFamily: {
        serif: ['"Noto Serif"', '"Playfair Display"', 'serif'],
        sans: ['"Open Sans"', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      backgroundImage: {
        'saffron-gradient': 'linear-gradient(135deg, #FF6B00 0%, #D95B00 100%)',
      },
      screens: {
        'print': { 'raw': 'print' },
      }
    },
  },
  plugins: [],
}
