module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#232946',
        },
        primary: {
          DEFAULT: '#eebbc3', // soft pink
        },
        accent: {
          DEFAULT: '#b8c1ec', // light blue
        },
        secondary: {
          DEFAULT: '#121629', // almost black
        },
        text: {
          DEFAULT: '#fffffe', // off-white
        },
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 