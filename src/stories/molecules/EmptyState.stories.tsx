import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '../../components/molecules/EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: '表示するメッセージ',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'データがありません',
  },
};

export const WithCustomMessage: Story = {
  args: {
    message: '参加者を追加してください',
  },
};

export const WithCustomClassName: Story = {
  args: {
    message: 'カスタムスタイルのメッセージ',
    className: 'text-red-500 font-bold',
  },
};

export const LongMessage: Story = {
  args: {
    message: 'これは非常に長いメッセージの例です。複数行にわたって表示される可能性があります。',
  },
};
