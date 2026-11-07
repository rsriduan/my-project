/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        delied: {
          primary: '#4F24E8',
          'primary-hover': '#431ec9',
          'primary-light': '#EEF2FF',
          secondary: '#171936',
          'secondary-hover': '#111329',
          surface: '#F5F3FF',
          'surface-light': '#FAF9FF',
          border: '#E5E7EB',
          dark: '#171936',
          slate: '#71758A',
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        bengali: ['Noto Sans Bengali', 'Hind Siliguri', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
