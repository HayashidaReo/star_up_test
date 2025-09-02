'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/dialog';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/table';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ExpenseForm } from '@/components/molecules/ExpenseForm';
import { ExpenseRow } from '@/components/molecules/ExpenseRow';
import { useAppStore } from '@/store/useAppStore';
import { Plus } from 'lucide-react';
import { MESSAGES, DEFAULT_CURRENCY } from '@/lib/constants';
import { ExpenseFormData } from '@/types';

export function ExpensesSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    payerId: '',
    currency: DEFAULT_CURRENCY,
  });

  const { participants, expenses, addExpense, removeExpense } = useAppStore();

  // 費用を追加する関数
  const handleAddExpense = (data: ExpenseFormData) => {
    addExpense({
      description: data.description.trim(),
      amount: parseFloat(data.amount),
      payerId: data.payerId,
      currency: data.currency,
    });

    // フォームをリセット
    setFormData({
      description: '',
      amount: '',
      payerId: '',
      currency: DEFAULT_CURRENCY,
    });
    setIsDialogOpen(false);
  };

  // フォームデータを更新する関数
  const handleFormDataChange = (data: ExpenseFormData) => {
    setFormData(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>費用</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={participants.length === 0}>
                <Plus className="mr-1 h-4 w-4" />
                {MESSAGES.ADD_EXPENSE}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>新しい費用を追加</DialogTitle>
              </DialogHeader>
              <ExpenseForm
                onSubmit={handleAddExpense}
                participants={participants}
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {expenses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>内容</TableHead>
                <TableHead>支払額</TableHead>
                <TableHead>支払者</TableHead>
                <TableHead>通貨</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  participants={participants}
                  onRemove={removeExpense}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            message={
              participants.length === 0
                ? MESSAGES.NO_PARTICIPANTS_FOR_EXPENSE
                : MESSAGES.NO_EXPENSES
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
