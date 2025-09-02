import type { Meta, StoryObj } from '@storybook/react';
import { ParticipantItem } from '../../components/molecules/ParticipantItem';
import { Participant } from '@/types';

const meta: Meta<typeof ParticipantItem> = {
  title: 'Molecules/ParticipantItem',
  component: ParticipantItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    participant: {
      description: '参加者の情報',
    },
    onRemove: {
      action: 'remove clicked',
      description: '削除ボタンがクリックされた時のコールバック',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockParticipant: Participant = {
  id: '1',
  name: 'John Doe',
};

export const Default: Story = {
  args: {
    participant: mockParticipant,
    onRemove: () => {}, // No-op function for Storybook
  },
};

export const SingleName: Story = {
  args: {
    participant: {
      id: '2',
      name: 'Alice',
    },
    onRemove: () => {}, // No-op function for Storybook
  },
};

export const MultipleWords: Story = {
  args: {
    participant: {
      id: '3',
      name: 'John Michael Smith',
    },
    onRemove: (id: string) => {},
  },
};

export const LongName: Story = {
  args: {
    participant: {
      id: '3',
      name: 'Christopher Alexander Anderson',
    },
    onRemove: () => {}, // No-op function for Storybook
  },
};

export const ShortName: Story = {
  args: {
    participant: {
      id: '4',
      name: 'Li',
    },
    onRemove: () => {}, // No-op function for Storybook
  },
};

export const JapaneseName: Story = {
  args: {
    participant: {
      id: '5',
      name: '田中太郎',
    },
    onRemove: () => {}, // No-op function for Storybook
  },
};
