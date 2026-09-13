/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // We will enforce dark mode in the design system
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        border: 'hsl(var(--border))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          hover: 'hsl(var(--primary-hover))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        text: {
          main: 'hsl(var(--text-main))',
          muted: 'hsl(var(--text-muted))',
        },
        feedback: {
          success: 'hsl(var(--success))',
          successMuted: 'hsl(var(--success-muted))',
          error: 'hsl(var(--error))',
          errorMuted: 'hsl(var(--error-muted))',
          warning: 'hsl(var(--warning))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'lg': '1rem',
        'md': '0.75rem',
        'sm': '0.5rem',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'premium-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
        'glow-primary': '0 0 20px 0 rgba(100, 100, 255, 0.15)',
        'glow-success': '0 0 20px 0 rgba(34, 197, 94, 0.15)',
        'glow-error': '0 0 20px 0 rgba(239, 68, 68, 0.15)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      }
    },
  },
  plugins: [],
}
