const { borderColor } = require("polished");

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka One', 'ui-serif']
      },
      textColor: {
        primary: '#471BB2',
        secondary: '#5E5E5E',
        warning: '#FA6F44'
      },
      borderColor: {
        primary: {
          DEFAULT: '#471bb2',
          dark: '#15006d'
        }
      },
      colors: {
        primary: {
          DEFAULT: '#471bb2',
          light: '#e8e4f5',
          lighter: '#D7CDF0',
          lightest: '#F3F2F8',
          hover: '#15006d',
          disabled: '#9182c6',
          gradientVia: '#5521B6',
          gradientTo: '#2DB7C4'
        },
        warning: {
          DEFAULT: '#FA6F44'
        },
        link: {
          DEFAULT: '#518cff',
          primary: '#471bb2'
        },
        success: {
          DEFAULT: '#1BB233'
        }
      },
      maxWidth: {
        container: '1040px'
      },
      borderRadius: {
        card: '10px',
        button: '20px'
      },
      height: {
        tokenInput: '80px'
      }
    }
  },
  variants: {
    extend: {
      ringWidth: ['active'],
      ringColor: ['active'],
      borderColor: ['focus'],
      backgroundColor: ['focus']
    }
  },
  plugins: []
}
