import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../components/atoms/badge';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const WithIcon: Story = {
  render: () => (
    <Badge>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mr-1 h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      Complete
    </Badge>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  ),
};

export const NumberBadge: Story = {
  args: {
    variant: 'destructive',
    children: '99+',
  },
};

export const LongText: Story = {
  args: {
    children: 'Very Long Badge Text',
  },
};

export const CustomColors: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge className="bg-green-100 text-green-800">Success</Badge>
      <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      <Badge className="bg-blue-100 text-blue-800">Info</Badge>
    </div>
  ),
};
