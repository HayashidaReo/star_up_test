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
        // カスタムカラーパレットをここで定義
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // 旅行費用計算アプリに適した色
        expense: {
          positive: '#10b981', // 緑色（収入）
          negative: '#ef4444', // 赤色（支出）
          neutral: '#6b7280',  // グレー（中立）
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
  plugins: [
    require('@tailwindcss/forms'),      // フォーム要素のスタイリング
    require('@tailwindcss/typography'), // リッチテキストのスタイリング
    require('@tailwindcss/aspect-ratio'), // アスペクト比の管理
  ],
};

export default config; 