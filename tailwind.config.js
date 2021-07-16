module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka One', 'ui-serif']
      },
      colors: {
        primary: {
          DEFAULT: '#471bb2',
          light: '#e8e4f5'
        },
        link: {
          DEFAULT: '#518cff'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
