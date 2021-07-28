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
          lightest: '#F3F2F8',
          hover: '#15006d',
          disabled: '#9182c6',
          gradientFrom: '#15006D',
          gradientVia: '#5521B6',
          gradientTo: '#2DB7C4'
        },
        link: {
          DEFAULT: '#518cff'
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
      ringColor: ['active']
    }
  },
  plugins: []
}
