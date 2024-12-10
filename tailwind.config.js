/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Important for using dark mode class-based toggle
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brandYellow: '#FFC50C',
        brandGray: {
          light: '#f7f7f7',
          DEFAULT: '#d1d5db',
          dark: '#374151',
        },
      },
    },
  },
  plugins: [],
};
