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
  (participantNames: string[] = []) =>
  (Story: any) => {
    // ストアをリセット
    useAppStore.getState().resetAll();

    // テストデータを追加
    participantNames.forEach((name) => {
      useAppStore.getState().addParticipant(name);
    });

    return Story();
  };

export const Empty: Story = {
  decorators: [withStore()],
};

export const WithParticipants: Story = {
  decorators: [withStore(['Alice', 'Bob', 'Charlie'])],
};

export const SingleParticipant: Story = {
  decorators: [withStore(['John Doe'])],
};

export const ManyParticipants: Story = {
  decorators: [withStore(['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'])],
};
