import type { Meta, StoryObj } from '@storybook/react';
import { ParticipantSelect } from '../../components/molecules/ParticipantSelect';
import { Participant } from '@/types';

const meta: Meta<typeof ParticipantSelect> = {
  title: 'Molecules/ParticipantSelect',
  component: ParticipantSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample participants with normal names
const normalParticipants: Participant[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

// Participants with long names to test overflow
const longNameParticipants: Participant[] = [
  { id: '1', name: 'あいうえおあいうえおあいうえおあいうえおあいうえお' },
  {
    id: '2',
    name: 'This is a very long participant name that should overflow',
  },
  { id: '3', name: 'かきくけこかきくけこかきくけこかきくけこかきくけこ' },
  {
    id: '4',
    name: 'Another extremely long participant name for testing purposes',
  },
];

export const Default: Story = {
  args: {
    participants: normalParticipants,
    value: '',
    placeholder: '参加者を選択',
  },
};

export const WithLongNames: Story = {
  args: {
    participants: longNameParticipants,
    value: '',
    placeholder: '参加者を選択',
  },
};

export const SelectedLongName: Story = {
  args: {
    participants: longNameParticipants,
    value: '1',
    placeholder: '参加者を選択',
  },
};
