import type { Meta, StoryObj } from '@storybook/react';
import { SettlementItem } from './SettlementItem';
import { Settlement } from '@/types';

const meta: Meta<typeof SettlementItem> = {
  title: 'Components/SettlementItem',
  component: SettlementItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    settlement: {
      description: '精算の情報',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockSettlement: Settlement = {
  from: 'Bob',
  to: 'Alice',
  amount: 3000,
};

export const Default: Story = {
  args: {
    settlement: mockSettlement,
  },
};

export const LargeAmount: Story = {
  args: {
    settlement: {
      from: 'Charlie',
      to: 'Alice',
      amount: 50000,
    },
  },
};

export const SmallAmount: Story = {
  args: {
    settlement: {
      from: 'David',
      to: 'Eve',
      amount: 100,
    },
  },
};

export const LongNames: Story = {
  args: {
    settlement: {
      from: 'Christopher Alexander Johnson',
      to: 'Elizabeth Margaret Williams',
      amount: 2500,
    },
  },
};

export const JapaneseNames: Story = {
  args: {
    settlement: {
      from: '田中太郎',
      to: '佐藤花子',
      amount: 1500,
    },
  },
};
