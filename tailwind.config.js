/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        neon: '#CCFF00',
        electric: '#7928CA',
      },
      boxShadow: {
        'neon-glow': '0 0 20px rgba(204, 255, 0, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        '4xl': 'var(--radius-4xl)',
        '5xl': 'var(--radius-5xl)',
      },
      ringWidth: {
        DEFAULT: 'var(--ring-width)',
      },
    },
  },
}
