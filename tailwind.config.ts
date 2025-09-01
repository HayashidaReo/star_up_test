import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // 以前設定した他のカスタムカラー
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        expense: {
          positive: 'hsl(var(--expense-positive))',
          negative: 'hsl(var(--expense-negative))',
          neutral: 'hsl(var(--expense-neutral))',
        },
      },
      fontFamily: {
        // 日本語フォントの設定
        sans: [
          'Inter',
          'Noto Sans JP',
          'Hiragino Sans',
          'Yu Gothic',
          'Meiryo',
          'sans-serif',
        ],
      },
      spacing: {
        // カスタムスペーシング
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        // カスタムボーダーラジウス
        '4xl': '2rem',
      },
    },
  },
};

export default config;
