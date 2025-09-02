import type { Meta, StoryObj } from '@storybook/react';
import { CurrencySelect } from './CurrencySelect';
import { CURRENCIES } from '@/lib/constants';
import { useState } from 'react';

const meta: Meta<typeof CurrencySelect> = {
  title: 'UI/CurrencySelect',
  component: CurrencySelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'select',
      options: Object.values(CURRENCIES),
      description: '選択された通貨',
    },
    placeholder: {
      control: 'text',
      description: 'プレースホルダーテキスト',
    },
    onValueChange: {
      action: 'value changed',
      description: '値が変更された時のコールバック',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// インタラクティブなストーリー用のコンポーネント
const InteractiveCurrencySelect = (args: any) => {
  const [value, setValue] = useState(args.value || CURRENCIES.JPY);
  
  return (
    <CurrencySelect
      {...args}
      value={value}
      onValueChange={(newValue) => {
        setValue(newValue);
        args.onValueChange?.(newValue);
      }}
    />
  );
};

export const Default: Story = {
  render: InteractiveCurrencySelect,
  args: {
    value: CURRENCIES.JPY,
    placeholder: '通貨を選択',
  },
};

export const WithUSD: Story = {
  render: InteractiveCurrencySelect,
  args: {
    value: CURRENCIES.USD,
    placeholder: 'Select currency',
  },
};

export const WithEUR: Story = {
  render: InteractiveCurrencySelect,
  args: {
    value: CURRENCIES.EUR,
    placeholder: 'Währung wählen',
  },
};

export const CustomPlaceholder: Story = {
  render: InteractiveCurrencySelect,
  args: {
    value: CURRENCIES.JPY,
    placeholder: 'カスタムプレースホルダー',
  },
};
