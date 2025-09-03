import type { Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';

// Storybookでモック環境を強制設定
if (typeof window !== 'undefined') {
  // ブラウザ環境での設定
  (window as any).process = (window as any).process || {};
  (window as any).process.env = (window as any).process.env || {};
  (window as any).process.env.STORYBOOK = 'true';
  (window as any).process.env.FORCE_MOCK_API = 'true';
}

// Node.js環境での設定
if (typeof process !== 'undefined') {
  process.env.STORYBOOK = 'true';
  process.env.FORCE_MOCK_API = 'true';
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: 'hsl(0 0% 100%)', // --background in light mode
        },
        {
          name: 'dark',
          value: 'hsl(0 0% 3.9%)', // --background in dark mode
        },
        {
          name: 'neutral',
          value: 'hsl(0 0% 96.1%)', // --secondary in light mode
        },
      ],
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
