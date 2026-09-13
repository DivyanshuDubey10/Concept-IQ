/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        white: 'hsl(var(--tw-color-white) / <alpha-value>)',
        black: 'hsl(var(--tw-color-black) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        surface: {
          DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
          elevated: 'hsl(var(--surface-elevated) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          hover: 'hsl(var(--primary-hover) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        text: {
          main: 'hsl(var(--text-main) / <alpha-value>)',
          muted: 'hsl(var(--text-muted) / <alpha-value>)',
        },
        // Top-level tokens so text-success, bg-success/10 etc. work everywhere
        success: 'hsl(var(--success) / <alpha-value>)',
        error: 'hsl(var(--error) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        // Keep legacy feedback namespace for backwards compat
        feedback: {
          success: 'hsl(var(--success) / <alpha-value>)',
          error: 'hsl(var(--error) / <alpha-value>)',
          warning: 'hsl(var(--warning) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        'xl': '1rem',
        'lg': '0.75rem',
        'md': '0.5rem',
        'sm': '0.375rem',
      },
      boxShadow: {
        'premium': '0 8px 32px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        'premium-hover': '0 20px 48px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)',
        'glass': 'inset 0 1px 0 rgba(255,255,255,0.08)',
        'glow-primary': '0 0 24px 0 rgba(99,88,255,0.25)',
        'glow-success': '0 0 24px 0 rgba(52,211,153,0.2)',
        'glow-error': '0 0 24px 0 rgba(239,68,68,0.2)',
        'nav-pill': '0 4px 16px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsl(var(--primary)), hsl(270 75% 65%))',
        'gradient-surface': 'linear-gradient(145deg, hsl(var(--surface-elevated)), hsl(var(--surface)))',
      },
      animation: {
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.25s ease-out',
        'fade-in-slow': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
        'shimmer': 'shimmer 2s infinite linear',
        'bounce-soft': 'bounceSoft 1s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
