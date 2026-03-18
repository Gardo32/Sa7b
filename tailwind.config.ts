import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ramadan: {
          950: '#022c22',
          900: '#064e3b',
          800: '#065f46',
          700: '#047857',
        },
      },
      boxShadow: {
        glow: '0 0 25px rgba(250, 204, 21, 0.45), 0 0 65px rgba(16, 185, 129, 0.35)',
        card: '0 20px 45px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        'islamic-pattern':
          'radial-gradient(circle at 25px 25px, rgba(250, 204, 21, 0.08) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(16, 185, 129, 0.08) 2px, transparent 0)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(250, 204, 21, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(250, 204, 21, 0.7)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        pulseGlow: 'pulseGlow 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
