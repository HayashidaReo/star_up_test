import type { Meta, StoryObj } from '@storybook/react';
import Home from '../../app/page';
import { useAppStore } from '@/store/useAppStore';
import { CURRENCIES } from '@/lib/constants';
import { useEffect } from 'react';

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
const withStore =
  (participantNames: string[] = [], expenseData: any[] = []) =>
  (Story: any) => {
    const StoryWithStore = () => {
      useEffect(() => {
        // ストアをリセット
        useAppStore.getState().resetAll();

        // 参加者を追加（addParticipantを使って正しくIDを生成）
        const addedParticipants: { [key: string]: string } = {};
        participantNames.forEach((name, index) => {
          useAppStore.getState().addParticipant(name);
          // 参加者のIDをマッピング（順番で予測可能）
          const participants = useAppStore.getState().participants;
          if (participants[index]) {
            addedParticipants[`${index + 1}`] = participants[index].id;
          }
        });

        console.log('Added participants:', useAppStore.getState().participants);

        // 費用を追加（正しいIDを使用）
        expenseData.forEach((expense) => {
          const correctPayerId =
            addedParticipants[expense.payerId] || expense.payerId;
          console.log(
            `Adding expense with payerId: ${correctPayerId}`,
            expense,
          );
          useAppStore.getState().addExpense({
            description: expense.description,
            amount: expense.amount,
            payerId: correctPayerId,
            currency: expense.currency,
          });
        });

        const finalState = useAppStore.getState();
        console.log('Final state:', {
          participants: finalState.participants,
          expenses: finalState.expenses,
          settlements: finalState.settlements,
        });
      }, []);

      return <Story />;
    };

    return <StoryWithStore />;
  };

export const Empty: Story = {
  decorators: [withStore()],
};

export const WithParticipants: Story = {
  decorators: [withStore(['Alice', 'Bob', 'Charlie'])],
};

export const WithExpenses: Story = {
  decorators: [
    withStore(
      ['Alice', 'Bob', 'Charlie'],
      [
        {
          description: '夕食代',
          amount: 6000,
          payerId: '1', // Alice
          currency: CURRENCIES.JPY,
        },
        {
          description: 'ガソリン代',
          amount: 3000,
          payerId: '2', // Bob
          currency: CURRENCIES.JPY,
        },
      ],
    ),
  ],
};

export const CompleteExample: Story = {
  decorators: [
    withStore(
      ['Alice', 'Bob', 'Charlie', 'David'],
      [
        {
          description: '夕食代',
          amount: 8000,
          payerId: '1', // Alice
          currency: CURRENCIES.JPY,
        },
        {
          description: 'ガソリン代',
          amount: 4000,
          payerId: '2', // Bob
          currency: CURRENCIES.JPY,
        },
        {
          description: 'ホテル代',
          amount: 12000,
          payerId: '3', // Charlie
          currency: CURRENCIES.JPY,
        },
        {
          description: 'お土産',
          amount: 2000,
          payerId: '4', // David
          currency: CURRENCIES.JPY,
        },
      ],
    ),
  ],
};

export const MixedCurrencies: Story = {
  decorators: [
    withStore(
      ['Alice', 'Bob'],
      [
        {
          description: 'Dinner',
          amount: 50,
          payerId: '1', // Alice
          currency: CURRENCIES.USD,
        },
        {
          description: 'Transport',
          amount: 30,
          payerId: '2', // Bob
          currency: CURRENCIES.EUR,
        },
      ],
    ),
  ],
};
