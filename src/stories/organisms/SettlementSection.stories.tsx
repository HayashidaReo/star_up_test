import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SettlementSection } from '../../components/organisms/SettlementSection';
import { useAppStore } from '@/store/useAppStore';
import { CURRENCIES } from '@/lib/constants';
import { useEffect } from 'react';
import type { Expense } from '@/types';

const meta: Meta<typeof SettlementSection> = {
  title: 'Organisms/SettlementSection',
  component: SettlementSection,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [],
    },
  },
  decorators: [
    (Story) => {
      // Storybookでモック環境を確実に設定
      if (typeof process !== 'undefined') {
        process.env.STORYBOOK = 'true';
        process.env.FORCE_MOCK_API = 'true';
      }
      if (typeof window !== 'undefined') {
        (window as any).process = (window as any).process || {};
        (window as any).process.env = (window as any).process.env || {};
        (window as any).process.env.STORYBOOK = 'true';
        (window as any).process.env.FORCE_MOCK_API = 'true';
      }
      return <Story />;
    },
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ストーリー用のデコレーター
const withStore =
  (participantNames: string[] = [], expenseData: Partial<Expense>[] = []) =>
  (Story: React.ComponentType) => {
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
        expenseData.forEach((expense) => {
          if (
            expense.payerId === undefined ||
            expense.amount === undefined ||
            expense.currency === undefined ||
            expense.description === undefined
          )
            return;
          const correctPayerId =
            addedParticipants[expense.payerId] || expense.payerId;
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

export const WithParticipantsOnly: Story = {
  decorators: [withStore(['Alice', 'Bob', 'Charlie'])],
};

export const WithSettlements: Story = {
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

export const ComplexSettlements: Story = {
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
