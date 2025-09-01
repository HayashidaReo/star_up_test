import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Home from './page'; // テスト対象のコンポーネント

// テストの説明
test('Home page should render main content', () => {
  // 1. コンポーネントを描画
  render(<Home />);

  // 2. main要素が存在することを確認
  const mainElement = screen.getByRole('main');
  expect(mainElement).toBeInTheDocument();

  // 3. Next.jsロゴが表示されることを確認
  const logo = screen.getByAltText('Next.js logo');
  expect(logo).toBeInTheDocument();

  // 4. リストが表示されることを確認
  const list = screen.getByRole('list');
  expect(list).toBeInTheDocument();

  // 5. リンクが表示されることを確認
  const deployLink = screen.getByRole('link', { name: /deploy now/i });
  expect(deployLink).toBeInTheDocument();

  const docsLink = screen.getByRole('link', { name: /read our docs/i });
  expect(docsLink).toBeInTheDocument();
});
