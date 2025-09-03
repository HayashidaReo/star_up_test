import type { Meta, StoryObj } from '@storybook/react';
import { CurrencySelectApi } from '../../components/molecules/CurrencySelectApi';
import { mockCurrencies } from '../../data/mockData';

// Storybookでモック環境を強制設定
if (typeof window !== 'undefined') {
  (window as any).process = { env: { STORYBOOK: 'true' } };
}

const meta = {
  title: 'Molecules/CurrencySelectApi',
  component: CurrencySelectApi,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'API連携でリアルタイム通貨データを取得する通貨選択コンポーネント。Storybookではモックデータを使用。',
      },
    },
    msw: {
      handlers: [],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '選択中の通貨コード',
    },
    onValueChange: {
      action: 'currency-changed',
      description: '通貨変更時のコールバック',
    },
    currencies: {
      control: 'object',
      description: '通貨リスト',
    },
    placeholder: {
      control: 'text',
      description: 'プレースホルダーテキスト',
    },
    isLoading: {
      control: 'boolean',
      description: 'ローディング状態',
    },
    error: {
      control: 'text',
      description: 'エラーメッセージ',
    },
  },
} satisfies Meta<typeof CurrencySelectApi>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'JPY',
    placeholder: '通貨を選択してください',
    currencies: mockCurrencies,
    onValueChange: () => {},
  },
};

export const NoSelection: Story = {
  args: {
    value: '',
    placeholder: '通貨を選択してください',
    currencies: mockCurrencies,
    onValueChange: () => {},
  },
};

export const USDSelected: Story = {
  args: {
    value: 'USD',
    placeholder: '通貨を選択してください',
    currencies: mockCurrencies,
    onValueChange: () => {},
  },
};

export const EURSelected: Story = {
  args: {
    value: 'EUR',
    placeholder: '通貨を選択してください',
    currencies: mockCurrencies,
    onValueChange: () => {},
  },
};

export const Loading: Story = {
  args: {
    value: '',
    placeholder: '通貨を選択してください',
    currencies: [],
    isLoading: true,
    onValueChange: () => {},
  },
};

export const Error: Story = {
  args: {
    value: '',
    placeholder: '通貨を選択してください',
    currencies: [],
    error: '通貨リストの取得に失敗しました',
    onValueChange: () => {},
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    value: '',
    placeholder: 'お好みの通貨をお選びください',
    currencies: mockCurrencies,
    onValueChange: () => {},
  },
};

export const Interactive: Story = {
  args: {
    value: 'JPY',
    placeholder: '通貨を選択してください',
    currencies: mockCurrencies,
    onValueChange: () => {},
  },
};
