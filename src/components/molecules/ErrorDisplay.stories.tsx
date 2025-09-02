import type { Meta, StoryObj } from '@storybook/react';
import { ErrorDisplay } from './ErrorDisplay';

const meta: Meta<typeof ErrorDisplay> = {
  title: 'Molecules/ErrorDisplay',
  component: ErrorDisplay,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['error', 'warning', 'info', 'success'],
    },
    onDismiss: { action: 'dismissed' },
    onAction: { action: 'action clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: {
    type: 'error',
    title: 'エラーが発生しました',
    message: '参加者名は必須です。有効な名前を入力してください。',
    onDismiss: undefined,
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    title: '注意',
    message: '参加者が1人しかいません。精算計算には2人以上の参加者が必要です。',
    onDismiss: undefined,
  },
};

export const Info: Story = {
  args: {
    type: 'info',
    title: '情報',
    message: 'データが正常に保存されました。ページを更新しても内容は保持されます。',
    onDismiss: undefined,
  },
};

export const Success: Story = {
  args: {
    type: 'success',
    title: '成功',
    message: '参加者「田中太郎」が正常に追加されました。',
    onDismiss: undefined,
  },
};

export const WithDismissButton: Story = {
  args: {
    type: 'error',
    title: 'エラーが発生しました',
    message: '入力された金額が無効です。正の数値を入力してください。',
    onDismiss: () => console.log('Dismissed'),
  },
};

export const WithActionButton: Story = {
  args: {
    type: 'warning',
    title: 'データが古い可能性があります',
    message: '最後の更新から時間が経過しています。最新のデータを確認しますか？',
    actionLabel: '更新',
    onAction: () => console.log('Refresh clicked'),
    onDismiss: () => console.log('Dismissed'),
  },
};

export const LongMessage: Story = {
  args: {
    type: 'error',
    title: '接続エラー',
    message: 'サーバーへの接続に失敗しました。ネットワーク接続を確認してください。この問題が続く場合は、管理者にお問い合わせください。詳細なエラーログは開発者ツールでご確認いただけます。',
    actionLabel: '再試行',
    onAction: () => console.log('Retry clicked'),
    onDismiss: () => console.log('Dismissed'),
  },
};
