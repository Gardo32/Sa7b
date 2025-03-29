/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf0dc',
          200: '#b9e1b9',
          300: '#8fd08f',
          400: '#5fb75f',
          500: '#4caf50', // primary color
          600: '#3d8c3d',
          700: '#2e692e',
          800: '#1e471e',
          900: '#0f230f',
        },
        secondary: {
          50: '#f5e9f7',
          100: '#ead2ef',
          200: '#d5a5df',
          300: '#c078cf',
          400: '#ab4cbf',
          500: '#8e24aa', // secondary color
          600: '#721d88',
          700: '#551666',
          800: '#390e44',
          900: '#1c0722',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
