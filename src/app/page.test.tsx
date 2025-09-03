import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Home from './page'; // テスト対象のコンポーネント

// コンポーネントをモック
vi.mock('../components/organisms/ParticipantsSection', () => ({
  ParticipantsSection: () => (
    <div data-testid="participants-section">Participants Section</div>
  ),
}));

vi.mock('../components/organisms/ExpensesSection', () => ({
  ExpensesSection: () => (
    <div data-testid="expenses-section">Expenses Section</div>
  ),
}));

vi.mock('../components/organisms/SettlementSection', () => ({
  SettlementSection: () => (
    <div data-testid="settlement-section">Settlement Section</div>
  ),
}));

// テストの説明
test('Home page should render main content', () => {
  // 1. コンポーネントを描画
  render(<Home />);

  // 2. アプリタイトルが表示されることを確認
  const title = screen.getByText('star_up_test');
  expect(title).toBeInTheDocument();

  // 3. 説明文が表示されることを確認
  const description = screen.getByText(
    '友人との旅行で発生した費用を簡単に精算',
  );
  expect(description).toBeInTheDocument();

  // 4. 各セクションが表示されることを確認
  const participantsSection = screen.getByTestId('participants-section');
  expect(participantsSection).toBeInTheDocument();

  const expensesSection = screen.getByTestId('expenses-section');
  expect(expensesSection).toBeInTheDocument();

  const settlementSection = screen.getByTestId('settlement-section');
  expect(settlementSection).toBeInTheDocument();
});
