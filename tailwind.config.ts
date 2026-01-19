import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#fdfbf7',
        pencil: '#2d2d2d',
        muted: '#e5e0d8',
        marker: '#ff4d4d',
        pen: '#2d5da1',
        postit: '#fff9c4',
      },
      fontFamily: {
        heading: ['var(--font-kalam)', 'cursive'],
        body: ['var(--font-patrick)', 'cursive'],
      },
      boxShadow: {
        hard: '4px 4px 0px 0px #2d2d2d',
        'hard-sm': '2px 2px 0px 0px #2d2d2d',
        'hard-lg': '6px 6px 0px 0px #2d2d2d',
      },
      borderRadius: {
        wobbly: '255px 15px 225px 15px / 15px 225px 15px 255px',
        'wobbly-alt': '15px 225px 15px 255px / 225px 15px 255px 15px',
      },
    },
  },
  plugins: [],
};

export default config;
