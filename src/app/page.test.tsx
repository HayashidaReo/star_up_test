// ダミーテスト
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Home from './page'; // テスト対象のコンポーネント

// テストの説明
test('Home page should have a heading', () => {
  // 1. コンポーネントを描画
  render(<Home />);

  // 2. h1要素（見出し）を探す
  const heading = screen.getByRole('heading', { level: 1 });

  // 3. 見出しが存在することを検証
  expect(heading).toBeInTheDocument();
});
