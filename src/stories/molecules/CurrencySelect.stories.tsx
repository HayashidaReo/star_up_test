import type { Meta, StoryObj } from '@storybook/react';
import { CurrencySelect } from '../../components/molecules/CurrencySelect';
import { CURRENCIES } from '@/lib/constants';
import { useState } from 'react';
import { Currency } from '@/types';

const meta: Meta<typeof CurrencySelect> = {
  title: 'Molecules/CurrencySelect',
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
interface CurrencySelectStoryArgs {
  value?: Currency;
  onValueChange?: (value: Currency) => void;
  placeholder?: string;
}

const InteractiveCurrencySelect = (args: CurrencySelectStoryArgs) => {
  const [value, setValue] = useState<Currency>(args.value || CURRENCIES.JPY);

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
  },
};

export const USD: Story = {
  render: InteractiveCurrencySelect,
  args: {
    value: CURRENCIES.USD,
  },
};

export const EUR: Story = {
  render: InteractiveCurrencySelect,
  args: {
    value: CURRENCIES.EUR,
  },
};

export const WithPlaceholder: Story = {
  render: InteractiveCurrencySelect,
  args: {
    value: CURRENCIES.JPY,
    placeholder: 'Please select currency',
  },
};
