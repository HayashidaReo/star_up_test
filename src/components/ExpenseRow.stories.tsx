import type { Meta, StoryObj } from '@storybook/react';
import { ExpenseRow } from './ExpenseRow';
import { Participant, Expense } from '@/types';
import { CURRENCIES } from '@/lib/constants';

const meta: Meta<typeof ExpenseRow> = {
  title: 'Components/ExpenseRow',
  component: ExpenseRow,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    expense: {
      description: '費用の情報',
    },
    participants: {
      description: '参加者のリスト',
    },
    onRemove: {
      action: 'remove clicked',
      description: '削除ボタンがクリックされた時のコールバック',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockParticipants: Participant[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

const mockExpense: Expense = {
  id: '1',
  description: '夕食代',
  amount: 8000,
  payerId: '1',
  currency: CURRENCIES.JPY,
};

export const Default: Story = {
  args: {
    expense: mockExpense,
    participants: mockParticipants,
    onRemove: (id: string) => console.log('Remove expense:', id),
  },
};

export const USDExpense: Story = {
  args: {
    expense: {
      id: '2',
      description: 'Hotel',
      amount: 150,
      payerId: '2',
      currency: CURRENCIES.USD,
    },
    participants: mockParticipants,
    onRemove: (id: string) => console.log('Remove expense:', id),
  },
};

export const EURExpense: Story = {
  args: {
    expense: {
      id: '3',
      description: 'Transport',
      amount: 50,
      payerId: '3',
      currency: CURRENCIES.EUR,
    },
    participants: mockParticipants,
    onRemove: (id: string) => console.log('Remove expense:', id),
  },
};

export const LargeAmount: Story = {
  args: {
    expense: {
      id: '4',
      description: '高額な費用',
      amount: 100000,
      payerId: '1',
      currency: CURRENCIES.JPY,
    },
    participants: mockParticipants,
    onRemove: (id: string) => console.log('Remove expense:', id),
  },
};

export const LongDescription: Story = {
  args: {
    expense: {
      id: '5',
      description: 'これは非常に長い説明文の例です。複数行にわたって表示される可能性があります。',
      amount: 5000,
      payerId: '2',
      currency: CURRENCIES.JPY,
    },
    participants: mockParticipants,
    onRemove: (id: string) => console.log('Remove expense:', id),
  },
};
