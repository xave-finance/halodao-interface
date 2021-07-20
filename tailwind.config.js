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
          light: '#e8e4f5',
          hover: '#15006d',
          disabled: '#9182c6'
        },
        link: {
          DEFAULT: '#518cff'
        },
        haloGray: {
          DEFAULT: '#f1f1f1'
        }
      }
    }
  },
  variants: {
    extend: {
      ringWidth: ['active'],
      ringColor: ['active']
    }
  },
  plugins: []
}
