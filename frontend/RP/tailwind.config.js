/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Merriweather', 'sans-serif'],
        fredoka: ['Fredoka', 'sans-serif'],
      },
      colors: {
        'custom-blue': '#839dd1',
        'custom-orange': '#D97706',
        'custom-dark-blue': '#6a7fc1',
        'custom-light-blue': '#F8FCFF',
        'custom-blue-2': '#6374ae',
        'custom-blue-3': '#9EB5E3',
        'custom-blue-4': '#4a5a89',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
