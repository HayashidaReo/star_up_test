import type { Meta, StoryObj } from '@storybook/react';
import Home from './page';
import { useAppStore } from '@/store/useAppStore';
import { CURRENCIES } from '@/lib/constants';

const meta: Meta<typeof Home> = {
  title: 'Pages/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ストーリー用のデコレーター
const withStore = (participants: any[] = [], expenses: any[] = []) => (Story: any) => {
  // ストアをリセット
  useAppStore.getState().resetAll();
  
  // 参加者を追加
  participants.forEach(participant => {
    useAppStore.getState().addParticipant(participant.name);
  });
  
  // 費用を追加
  expenses.forEach(expense => {
    useAppStore.getState().addExpense(expense);
  });
  
  return Story();
};

export const Empty: Story = {
  decorators: [withStore()],
};

export const WithParticipants: Story = {
  decorators: [withStore([
    { name: 'Alice' },
    { name: 'Bob' },
    { name: 'Charlie' },
  ])],
};

export const WithExpenses: Story = {
  decorators: [withStore(
    [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
    ],
    [
      {
        description: '夕食代',
        amount: 6000,
        payerId: '1',
        currency: CURRENCIES.JPY,
      },
      {
        description: 'ガソリン代',
        amount: 3000,
        payerId: '2',
        currency: CURRENCIES.JPY,
      },
    ]
  )],
};

export const CompleteExample: Story = {
  decorators: [withStore(
    [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'David' },
    ],
    [
      {
        description: '夕食代',
        amount: 8000,
        payerId: '1',
        currency: CURRENCIES.JPY,
      },
      {
        description: 'ガソリン代',
        amount: 4000,
        payerId: '2',
        currency: CURRENCIES.JPY,
      },
      {
        description: 'ホテル代',
        amount: 12000,
        payerId: '3',
        currency: CURRENCIES.JPY,
      },
      {
        description: 'お土産',
        amount: 2000,
        payerId: '4',
        currency: CURRENCIES.JPY,
      },
    ]
  )],
};

export const MixedCurrencies: Story = {
  decorators: [withStore(
    [
      { name: 'Alice' },
      { name: 'Bob' },
    ],
    [
      {
        description: 'Dinner',
        amount: 50,
        payerId: '1',
        currency: CURRENCIES.USD,
      },
      {
        description: 'Transport',
        amount: 30,
        payerId: '2',
        currency: CURRENCIES.EUR,
      },
    ]
  )],
};
