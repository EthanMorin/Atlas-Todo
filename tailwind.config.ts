import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        elevated: '0 20px 45px -25px rgba(15, 23, 42, 0.4)',
        card: '0 14px 32px -12px rgba(15, 23, 42, 0.35)'
      },
      backgroundImage: {
        'frosted-panel': 'linear-gradient(140deg, rgba(255,255,255,0.9) 0%, rgba(244,244,255,0.92) 100%)',
        'dark-frosted': 'linear-gradient(140deg, rgba(15,23,42,0.92) 0%, rgba(30,41,59,0.88) 100%)'
      }
    }
  },
  plugins: []
} satisfies Config;
