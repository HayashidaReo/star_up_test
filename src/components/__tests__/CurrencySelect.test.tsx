import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test-utils';
import { CurrencySelect } from '../molecules/CurrencySelect';
import { CURRENCIES } from '@/lib/constants';

describe('CurrencySelect', () => {
  const mockOnValueChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default placeholder', () => {
    render(
      <CurrencySelect
        value={CURRENCIES.JPY}
        onValueChange={mockOnValueChange}
      />,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    const customPlaceholder = 'Select currency';
    render(
      <CurrencySelect
        value={CURRENCIES.JPY}
        onValueChange={mockOnValueChange}
        placeholder={customPlaceholder}
      />,
    );

    expect(screen.getByText(customPlaceholder)).toBeInTheDocument();
  });

  it('should display all currency options', async () => {
    render(
      <CurrencySelect
        value={CURRENCIES.JPY}
        onValueChange={mockOnValueChange}
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    // オプションが表示されるまで待機
    await screen.findByText('JPY (¥)');
    expect(screen.getByText('JPY (¥)')).toBeInTheDocument();
    expect(screen.getByText('USD ($)')).toBeInTheDocument();
    expect(screen.getByText('EUR (€)')).toBeInTheDocument();
  });

  it('should call onValueChange when option is selected', async () => {
    render(
      <CurrencySelect
        value={CURRENCIES.JPY}
        onValueChange={mockOnValueChange}
      />,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const usdOption = await screen.findByText('USD ($)');
    fireEvent.click(usdOption);

    expect(mockOnValueChange).toHaveBeenCalledWith(CURRENCIES.USD);
  });
});
