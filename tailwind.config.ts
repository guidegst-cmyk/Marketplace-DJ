import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F1',
        ink: '#20242A',
        muted: '#8B8478',
        line: '#E3DCCD',
        copper: {
          DEFAULT: '#C2723A',
          dark: '#A55A28',
          light: '#F1D9C6',
        },
        teal: {
          DEFAULT: '#2F6E68',
          dark: '#234F4B',
          light: '#DCEAE8',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
      },
    },
  },
  plugins: [],
};

export default config;
