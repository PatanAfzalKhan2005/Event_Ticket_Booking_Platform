module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5F259F',
        'primary-dark': '#3B0F70',
        'primary-light': '#9C6ADE',
        bg: '#F6F4FF',
        card: '#FFFFFF',
        text: '#1A1A1A',
        border: '#E6DDF7'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(41, 17, 82, 0.08)',
        purple: '0 24px 55px rgba(59, 15, 112, 0.28)'
      }
    }
  },
  plugins: []
}
