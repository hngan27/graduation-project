/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,pug}'],
  theme: {
    extend: {
      colors: {
        'brand-light': '#DFF2EB',
        'brand-light-2': '#e3ebf2',
        'brand-mid': '#94B4C1',
        'brand-primary': '#547792',
        'brand-primary-dark': '#4A628A',
      },
    },
  },
  plugins: [],
};
