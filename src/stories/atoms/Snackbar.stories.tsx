import type { Meta, StoryObj } from '@storybook/react';
import { Snackbar } from '@/components/atoms/snackbar';
import { useState } from 'react';

const meta = {
  title: 'Atoms/Snackbar',
  component: Snackbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['error', 'warning', 'info', 'success'],
    },
    autoHideDuration: {
      control: { type: 'number' },
    },
    onClose: { action: 'closed' },
  },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// インタラクティブなストーリーのラッパー
function InteractiveSnackbar(args: any) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsVisible(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        スナックバーを表示
      </button>
      <Snackbar
        {...args}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <InteractiveSnackbar {...args} />,
  args: {
    message: 'これはデフォルトのエラーメッセージです',
    type: 'error',
    isVisible: false,
    autoHideDuration: 5000,
    onClose: () => {},
  },
};

export const Error: Story = {
  render: (args) => <InteractiveSnackbar {...args} />,
  args: {
    message: 'エラーが発生しました',
    type: 'error',
    isVisible: false,
    onClose: () => {},
  },
};

export const Warning: Story = {
  render: (args) => <InteractiveSnackbar {...args} />,
  args: {
    message: '注意してください',
    type: 'warning',
    isVisible: false,
    onClose: () => {},
  },
};

export const Info: Story = {
  render: (args) => <InteractiveSnackbar {...args} />,
  args: {
    message: '情報をお知らせします',
    type: 'info',
    isVisible: false,
    onClose: () => {},
  },
};

export const Success: Story = {
  render: (args) => <InteractiveSnackbar {...args} />,
  args: {
    message: '正常に完了しました',
    type: 'success',
    isVisible: false,
    onClose: () => {},
  },
};

export const LongMessage: Story = {
  render: (args) => <InteractiveSnackbar {...args} />,
  args: {
    message: 'これは非常に長いメッセージの例です。ユーザーに詳細な情報を提供する必要がある場合に使用します。',
    type: 'info',
    isVisible: false,
    onClose: () => {},
  },
};
