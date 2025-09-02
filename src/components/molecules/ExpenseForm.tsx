import React from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { CurrencySelect } from '@/components/molecules/CurrencySelect';
import { ParticipantSelect } from '@/components/molecules/ParticipantSelect';
import { Participant, ExpenseFormData, Currency } from '@/types';
import { PLACEHOLDERS, MESSAGES } from '@/lib/constants';
import { isValidString, isValidNumber } from '@/lib/utils';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  participants: Participant[];
  formData: ExpenseFormData;
  onFormDataChange: (data: ExpenseFormData) => void;
  onClose: () => void;
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
}: ExpenseFormProps) {
  const handleSubmit = () => {
    if (
      isValidString(formData.description) &&
      isValidNumber(formData.amount) &&
      isValidString(formData.payerId)
    ) {
      onSubmit(formData);
    }
  };

  const isFormValid =
    isValidString(formData.description) &&
    isValidNumber(formData.amount) &&
    isValidString(formData.payerId);

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
          onChange={(e) =>
            onFormDataChange({
              ...formData,
              description: e.target.value,
            })
          }
        />
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
          onChange={(e) =>
            onFormDataChange({
              ...formData,
              amount: e.target.value,
            })
          }
        />
      </div>

      {/* 支払者選択 */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">支払者</label>
        <ParticipantSelect
          participants={participants}
          value={formData.payerId}
          onValueChange={(value) =>
            onFormDataChange({ ...formData, payerId: value })
          }
        />
      </div>

      {/* 通貨選択 */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">通貨</label>
        <CurrencySelect
          value={formData.currency}
          onValueChange={(value: Currency) =>
            onFormDataChange({ ...formData, currency: value })
          }
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          {MESSAGES.CANCEL}
        </Button>
        <Button onClick={handleSubmit} disabled={!isFormValid}>
          {MESSAGES.ADD_PARTICIPANT}
        </Button>
      </div>
    </div>
  );
}
