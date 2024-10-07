/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        embed: ['Embed', 'sans-serif'],
      },
      colors: {
        'custom-blue': '#092b5a',
        'custom-orange': '#D97706',
        'custom-dark-blue': '#304878',
        'custom-light-blue': '#F8FCFF',
        'custom-blue-2': '#6374ae',
        'custom-yellow': '#f0a818',
        'custom-blue-4': '#4a5a89',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
