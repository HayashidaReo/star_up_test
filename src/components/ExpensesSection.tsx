'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppStore } from '@/store/useAppStore';
import { Plus, X } from 'lucide-react';

export function ExpensesSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    payerId: '',
    currency: 'JPY' as 'JPY' | 'USD' | 'EUR',
  });

  const { participants, expenses, addExpense, removeExpense } = useAppStore();

  // 費用を追加する関数
  const handleAddExpense = () => {
    if (
      newExpense.description.trim() &&
      newExpense.amount &&
      newExpense.payerId
    ) {
      addExpense({
        description: newExpense.description.trim(),
        amount: parseFloat(newExpense.amount),
        payerId: newExpense.payerId,
        currency: newExpense.currency,
      });

      // フォームをリセット
      setNewExpense({
        description: '',
        amount: '',
        payerId: '',
        currency: 'JPY',
      });
      setIsDialogOpen(false);
    }
  };

  // 通貨記号を取得する関数
  const getCurrencySymbol = (currency: string): string => {
    switch (currency) {
      case 'JPY':
        return '¥';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      default:
        return '¥';
    }
  };

  // 支払者の名前を取得する関数
  const getPayerName = (payerId: string): string => {
    const participant = participants.find((p) => p.id === payerId);
    return participant ? participant.name : '不明';
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
                費用を追加
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>新しい費用を追加</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* 内容入力 */}
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    内容
                  </label>
                  <Input
                    id="description"
                    placeholder="例: 夕食代"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
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
                    placeholder="例: 8000"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* 支払者選択 */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">支払者</label>
                  <Select
                    value={newExpense.payerId}
                    onValueChange={(value) =>
                      setNewExpense((prev) => ({ ...prev, payerId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="支払者を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {participants.map((participant) => (
                        <SelectItem key={participant.id} value={participant.id}>
                          {participant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 通貨選択 */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">通貨</label>
                  <Select
                    value={newExpense.currency}
                    onValueChange={(value: 'JPY' | 'USD' | 'EUR') =>
                      setNewExpense((prev) => ({ ...prev, currency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleAddExpense}
                  disabled={
                    !newExpense.description.trim() ||
                    !newExpense.amount ||
                    !newExpense.payerId
                  }
                >
                  追加
                </Button>
              </div>
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
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {expense.description}
                  </TableCell>
                  <TableCell>
                    {getCurrencySymbol(expense.currency)}
                    {expense.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{getPayerName(expense.payerId)}</TableCell>
                  <TableCell>{expense.currency}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExpense(expense.id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center text-gray-500">
            {participants.length === 0
              ? 'まず参加者を追加してください'
              : '費用を追加してください'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
