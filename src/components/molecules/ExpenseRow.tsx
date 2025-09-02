import React from 'react';
import { TableCell, TableRow } from '@/components/atoms/table';
import { Button } from '@/components/atoms/button';
import { X } from 'lucide-react';
import { Expense, Participant } from '@/types';
import { formatAmount } from '@/lib/utils';

interface ExpenseRowProps {
  expense: Expense;
  participants: Participant[];
  onRemove: (id: string) => void;
}

/**
 * 費用テーブルの行コンポーネント
 */
export function ExpenseRow({
  expense,
  participants,
  onRemove,
}: ExpenseRowProps) {
  const payer = participants.find((p) => p.id === expense.payerId);
  const payerName = payer ? payer.name : '不明';

  return (
    <TableRow>
      <TableCell className="font-medium">{expense.description}</TableCell>
      <TableCell>{formatAmount(expense.amount, expense.currency)}</TableCell>
      <TableCell>{payerName}</TableCell>
      <TableCell>{expense.currency}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(expense.id)}
          className="text-red-500 hover:bg-red-50 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
