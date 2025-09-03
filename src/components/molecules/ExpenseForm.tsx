import React, { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Snackbar } from '@/components/atoms/snackbar';
import { CurrencySelect } from '@/components/molecules/CurrencySelect';
import { ParticipantSelect } from '@/components/molecules/ParticipantSelect';
import {
  Participant,
  ExpenseFormData,
  Currency,
  CurrencySymbol,
} from '@/types';
import { PLACEHOLDERS, MESSAGES } from '@/lib/constants';
import { validateExpenseSafe } from '@/lib/schemas';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  participants: Participant[];
  formData: ExpenseFormData;
  onFormDataChange: (data: ExpenseFormData) => void;
  onClose: () => void;
  currencies: CurrencySymbol[];
  currenciesLoading: boolean;
  currenciesError: string | null;
}

/**
 * 費用追加フォームのコンポーネント
 */
export function ExpenseForm({
  onSubmit,
  participants,
  formData,
  onFormDataChange,
  onClose,
  currencies,
  currenciesLoading,
  currenciesError,
}: ExpenseFormProps) {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [snackbar, setSnackbar] = useState<{
    message: string;
    isVisible: boolean;
  }>({ message: '', isVisible: false });

  const handleSubmit = () => {
    const result = validateExpenseSafe(formData);

    if (result.success) {
      onSubmit(result.data);
      setValidationErrors({});
      setSnackbar({ message: '', isVisible: false });
    } else {
      // バリデーションエラーをフィールドごとに整理
      const errors: Record<string, string> = {};
      const errorMessages: string[] = [];

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
        errorMessages.push(`${getFieldLabel(field)}: ${issue.message}`);
      });

      setValidationErrors(errors);

      // エラー内容をスナックバーで表示
      const message = `入力内容に問題があります: ${errorMessages.join(', ')}`;
      setSnackbar({ message, isVisible: true });
    }
  };

  const getFieldLabel = (field: string): string => {
    switch (field) {
      case 'description':
        return '内容';
      case 'amount':
        return '支払額';
      case 'payerId':
        return '支払者';
      case 'currency':
        return '通貨';
      default:
        return field;
    }
  };

  const handleInputChange = (field: keyof ExpenseFormData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    onFormDataChange(updatedData);

    // リアルタイムバリデーション（既にエラーがある場合のみ）
    if (validationErrors[field]) {
      const result = validateExpenseSafe(updatedData);
      if (result.success) {
        const newErrors = { ...validationErrors };
        delete newErrors[field];
        setValidationErrors(newErrors);
      }
    }
  };

  // フォームが有効かどうかをチェック
  const isFormValid = validateExpenseSafe(formData).success;

  return (
    <div className="grid gap-4 py-4">
      {/* 内容入力 */}
      <div className="grid gap-2">
        <label htmlFor="description" className="text-sm font-medium">
          内容
        </label>
        <Input
          id="description"
          placeholder={PLACEHOLDERS.EXPENSE_DESCRIPTION}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={validationErrors.description ? 'border-red-500' : ''}
        />
        {validationErrors.description && (
          <p className="text-sm text-red-500">{validationErrors.description}</p>
        )}
      </div>

      {/* 支払額入力 */}
      <div className="grid gap-2">
        <label htmlFor="amount" className="text-sm font-medium">
          支払額
        </label>
        <Input
          id="amount"
          type="number"
          placeholder={PLACEHOLDERS.EXPENSE_AMOUNT}
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          className={validationErrors.amount ? 'border-red-500' : ''}
        />
        {validationErrors.amount && (
          <p className="text-sm text-red-500">{validationErrors.amount}</p>
        )}
      </div>

      {/* 支払者選択 */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">支払者</label>
        <ParticipantSelect
          participants={participants}
          value={formData.payerId}
          onValueChange={(value) => handleInputChange('payerId', value)}
        />
        {validationErrors.payerId && (
          <p className="text-sm text-red-500">{validationErrors.payerId}</p>
        )}
      </div>

      {/* 通貨選択 */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">通貨</label>
        <CurrencySelect
          value={formData.currency as Currency}
          onValueChange={(value: Currency) =>
            handleInputChange('currency', value)
          }
          currencies={currencies}
          currenciesLoading={currenciesLoading}
          currenciesError={currenciesError}
        />
        {validationErrors.currency && (
          <p className="text-sm text-red-500">{validationErrors.currency}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          {MESSAGES.CANCEL}
        </Button>
        <Button
          onClick={handleSubmit}
          className={!isFormValid ? 'opacity-60' : ''}
        >
          {MESSAGES.ADD_PARTICIPANT}
        </Button>
      </div>

      {/* スナックバー */}
      <Snackbar
        message={snackbar.message}
        type="error"
        isVisible={snackbar.isVisible}
        onClose={() => setSnackbar({ message: '', isVisible: false })}
      />
    </div>
  );
}
