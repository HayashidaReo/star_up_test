import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseForm } from '../ExpenseForm';
import { Participant, ExpenseFormData } from '@/types';

// 型定義: モックコンポーネントのプロパティ
interface MockButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  [key: string]: unknown;
}

interface MockInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: unknown;
}

interface MockCurrencySelectProps {
  value?: string;
  onChange?: (value: string) => void;
  [key: string]: unknown;
}

interface MockParticipantSelectProps {
  participants?: Participant[];
  value?: string;
  onChange?: (value: string) => void;
  [key: string]: unknown;
}

// Mock components to avoid dependency issues
vi.mock('@/components/atoms/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: MockButtonProps) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/atoms/input', () => ({
  Input: ({ placeholder, value, onChange, ...props }: MockInputProps) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  ),
}));

vi.mock('@/components/molecules/CurrencySelect', () => ({
  CurrencySelect: ({ value, onChange, ...props }: MockCurrencySelectProps) => (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      role="combobox"
      {...props}
    >
      <option value="JPY">JPY</option>
      <option value="USD">USD</option>
    </select>
  ),
}));

vi.mock('@/components/molecules/ParticipantSelect', () => ({
  ParticipantSelect: ({
    participants,
    value,
    onChange,
    ...props
  }: MockParticipantSelectProps) => (
    <div>
      <div>支払者を選択</div>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      >
        <option value="">選択してください</option>
        {participants?.map((participant: Participant) => (
          <option key={participant.id} value={participant.id}>
            {participant.name}
          </option>
        ))}
      </select>
    </div>
  ),
}));

const mockParticipants: Participant[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

const mockFormData: ExpenseFormData = {
  description: '',
  amount: '',
  currency: 'JPY',
  payerId: '',
};

describe('ExpenseForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnFormDataChange = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 型定義: renderExpenseFormのpropsの型
  interface RenderExpenseFormProps {
    onSubmit?: typeof mockOnSubmit;
    participants?: Participant[];
    formData?: ExpenseFormData;
    onFormDataChange?: typeof mockOnFormDataChange;
    onClose?: typeof mockOnClose;
  }

  const renderExpenseForm = (props: RenderExpenseFormProps = {}) => {
    const defaultProps = {
      onSubmit: mockOnSubmit,
      participants: mockParticipants,
      formData: mockFormData,
      onFormDataChange: mockOnFormDataChange,
      onClose: mockOnClose,
      ...props,
    };

    return render(
      <ExpenseForm
        currencies={[]}
        currenciesLoading={false}
        currenciesError={null}
        {...defaultProps}
      />,
    );
  };

  it('should render all form fields', () => {
    renderExpenseForm();

    expect(screen.getByPlaceholderText(/例: 夕食代/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/例: 8000/)).toBeInTheDocument();
    expect(screen.getAllByRole('combobox')).toHaveLength(2); // Currency and participant selects
    expect(screen.getByText('支払者を選択')).toBeInTheDocument();
  });

  it('should render submit and cancel buttons', () => {
    renderExpenseForm();

    expect(screen.getByRole('button', { name: /追加/ })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /キャンセル/ }),
    ).toBeInTheDocument();
  });

  it('should call onFormDataChange when description changes', async () => {
    renderExpenseForm();

    const descriptionInput = screen.getByPlaceholderText(/例: 夕食代/);

    // fireEvent.changeを使用して直接値を設定
    fireEvent.change(descriptionInput, { target: { value: 'ランチ代' } });

    // 変更が呼ばれることを確認
    expect(mockOnFormDataChange).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'ランチ代',
      }),
    );
  });

  it('should call onFormDataChange when amount changes', async () => {
    renderExpenseForm();

    const amountInput = screen.getByPlaceholderText(/例: 8000/);

    // fireEvent.changeを使用して直接値を設定
    fireEvent.change(amountInput, { target: { value: '1000' } });

    // 変更が呼ばれることを確認
    expect(mockOnFormDataChange).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: '1000',
      }),
    );
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderExpenseForm();

    const cancelButton = screen.getByRole('button', { name: /キャンセル/ });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not submit form with empty fields', async () => {
    const user = userEvent.setup();
    renderExpenseForm();

    const submitButton = screen.getByRole('button', { name: /追加/ });
    await user.click(submitButton);

    // 空のフィールドではsubmitが呼ばれない
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const validFormData: ExpenseFormData = {
      description: 'ランチ代',
      amount: '1000',
      currency: 'JPY',
      payerId: '1',
    };

    renderExpenseForm({ formData: validFormData });

    const submitButton = screen.getByRole('button', { name: /追加/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(validFormData);
    });
  });

  it('should not submit form with invalid amount', async () => {
    const user = userEvent.setup();
    const invalidFormData: ExpenseFormData = {
      description: 'ランチ代',
      amount: '-100',
      currency: 'JPY',
      payerId: '1',
    };

    renderExpenseForm({ formData: invalidFormData });

    const submitButton = screen.getByRole('button', { name: /追加/ });
    await user.click(submitButton);

    // 無効な金額ではsubmitが呼ばれない
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation when no participants and button is pressed', async () => {
    const user = userEvent.setup();
    renderExpenseForm({ participants: [] });

    const submitButton = screen.getByRole('button', { name: /追加/ });
    expect(submitButton).not.toBeDisabled(); // ボタンは押せる
    expect(submitButton).toHaveClass('opacity-60'); // ただし見た目は薄い

    // ボタンを押すとバリデーションエラーが表示される
    await user.click(submitButton);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onFormDataChange when form data changes', async () => {
    const user = userEvent.setup();
    renderExpenseForm();

    // フォームの基本動作をテスト
    const descriptionInput = screen.getByPlaceholderText(/例: 夕食代/);
    await user.type(descriptionInput, 'テスト');

    // onFormDataChangeが呼ばれたことを確認
    expect(mockOnFormDataChange).toHaveBeenCalled();
  });

  it('should handle currency change', async () => {
    renderExpenseForm();

    // CurrencySelectコンポーネントのテストは別途行う前提で、
    // 複数のcomboboxが存在するため、getAllByRoleを使用
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes).toHaveLength(2);
  });

  it('should handle participant selection', () => {
    renderExpenseForm();

    // ParticipantSelectコンポーネントのテストは別途行う前提で、
    // propsが正しく渡されることを確認
    expect(screen.getByText('支払者を選択')).toBeInTheDocument();
  });
});
