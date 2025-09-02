import type { Meta, StoryObj } from '@storybook/react';
import { ExpensesSection } from '../../components/ExpensesSection';
import { useAppStore } from '@/store/useAppStore';
import { CURRENCIES } from '@/lib/constants';
import { useEffect } from 'react';

const meta: Meta<typeof ExpensesSection> = {
  title: 'Organisms/ExpensesSection',
  component: ExpensesSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ストーリー用のデコレーター
const withStore = (participantNames: string[] = [], expenseData: any[] = []) => (Story: any) => {
  const StoryWithStore = () => {
    useEffect(() => {
      // ストアをリセット
      useAppStore.getState().resetAll();
      
      // 参加者を追加
      const addedParticipants: { [key: string]: string } = {};
      participantNames.forEach((name, index) => {
        useAppStore.getState().addParticipant(name);
        const participants = useAppStore.getState().participants;
        if (participants[index]) {
          addedParticipants[`${index + 1}`] = participants[index].id;
        }
      });
      
      // 費用を追加
      expenseData.forEach(expense => {
        const correctPayerId = addedParticipants[expense.payerId] || expense.payerId;
        useAppStore.getState().addExpense({
          description: expense.description,
          amount: expense.amount,
          payerId: correctPayerId,
          currency: expense.currency,
        });
      });
    }, []);

    return <Story />;
  };

  return <StoryWithStore />;
};

export const Empty: Story = {
  decorators: [withStore()],
};

export const WithParticipantsNoExpenses: Story = {
  decorators: [withStore(['Alice', 'Bob', 'Charlie'])],
};

export const WithExpenses: Story = {
  decorators: [withStore(
    ['Alice', 'Bob', 'Charlie'],
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
      {
        description: 'ホテル代',
        amount: 8000,
        payerId: '3',
        currency: CURRENCIES.JPY,
      },
    ]
  )],
};

export const ManyExpenses: Story = {
  decorators: [withStore(
    ['Alice', 'Bob', 'Charlie', 'David'],
    [
      {
        description: '朝食代',
        amount: 2000,
        payerId: '1',
        currency: CURRENCIES.JPY,
      },
      {
        description: 'ランチ代',
        amount: 4500,
        payerId: '2',
        currency: CURRENCIES.JPY,
      },
      {
        description: '夕食代',
        amount: 8000,
        payerId: '3',
        currency: CURRENCIES.JPY,
      },
      {
        description: 'ガソリン代',
        amount: 5000,
        payerId: '4',
        currency: CURRENCIES.JPY,
      },
      {
        description: 'お土産代',
        amount: 3000,
        payerId: '1',
        currency: CURRENCIES.JPY,
      },
      {
        description: '入場料',
        amount: 2500,
        payerId: '2',
        currency: CURRENCIES.JPY,
      },
    ]
  )],
};
