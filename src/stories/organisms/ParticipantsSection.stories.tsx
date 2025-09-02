import type { Meta, StoryObj } from '@storybook/react';
import { ParticipantsSection } from '../../components/organisms/ParticipantsSection';
import { useAppStore } from '@/store/useAppStore';

const meta: Meta<typeof ParticipantsSection> = {
  title: 'Organisms/ParticipantsSection',
  component: ParticipantsSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ストーリー用のデコレーター
const withStore =
  (participants: any[] = []) =>
  (Story: any) => {
    // ストアをリセット
    useAppStore.getState().resetAll();

    // テストデータを追加
    participants.forEach((participant) => {
      useAppStore.getState().addParticipant(participant.name);
    });

    return Story();
  };

export const Empty: Story = {
  decorators: [withStore()],
};

export const WithParticipants: Story = {
  decorators: [
    withStore([{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]),
  ],
};

export const SingleParticipant: Story = {
  decorators: [withStore([{ name: 'John Doe' }])],
};

export const ManyParticipants: Story = {
  decorators: [
    withStore([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'David' },
      { name: 'Eve' },
      { name: 'Frank' },
    ]),
  ],
};
