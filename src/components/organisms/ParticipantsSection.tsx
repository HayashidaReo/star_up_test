'use client';

import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ParticipantItem } from '@/components/molecules/ParticipantItem';
import { useAppStore, participantsSelector } from '@/store/useAppStore';
import { Plus } from 'lucide-react';
import { PLACEHOLDERS, MESSAGES } from '@/lib/constants';
import { validateParticipant } from '@/lib/schemas';

export function ParticipantsSection() {
  const [newParticipantName, setNewParticipantName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const participants = useAppStore(participantsSelector);

  // アクションをuseCallbackでメモ化して安定した参照を保証
  const addParticipant = useCallback(
    (name: string) => useAppStore.getState().addParticipant(name),
    [],
  );
  const removeParticipant = useCallback(
    (id: string) => useAppStore.getState().removeParticipant(id),
    [],
  );

  // 参加者を追加する関数
  const handleAddParticipant = () => {
    const result = validateParticipant({ name: newParticipantName });

    if (result.success) {
      addParticipant(result.data.name);
      setNewParticipantName(''); // 入力フィールドをクリア
      setValidationError(null); // エラーをクリア
    } else {
      // バリデーションエラーを表示
      setValidationError(
        result.error.issues[0]?.message || 'エラーが発生しました',
      );
    }
  };

  // 入力値が変更された時のバリデーション
  const handleInputChange = (value: string) => {
    setNewParticipantName(value);
    if (validationError) {
      // リアルタイムバリデーション
      const result = validateParticipant({ name: value });
      if (result.success) {
        setValidationError(null);
      } else {
        setValidationError(
          result.error.issues[0]?.message || 'エラーが発生しました',
        );
      }
    }
  };

  // Enterキーで参加者を追加
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddParticipant();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>参加者</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 参加者追加フォーム */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder={PLACEHOLDERS.PARTICIPANT_NAME}
              value={newParticipantName}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`flex-1 ${validationError ? 'border-red-500' : ''}`}
            />
            <Button
              onClick={handleAddParticipant}
              disabled={!newParticipantName.trim()}
              size="sm"
            >
              <Plus className="mr-1 h-4 w-4" />
              {MESSAGES.ADD_PARTICIPANT}
            </Button>
          </div>
          {/* バリデーションエラー表示 */}
          {validationError && (
            <p className="text-sm text-red-500">{validationError}</p>
          )}
        </div>

        {/* 参加者リスト */}
        {participants.length > 0 ? (
          <div className="space-y-2">
            {participants.map((participant) => (
              <ParticipantItem
                key={participant.id}
                participant={participant}
                onRemove={removeParticipant}
              />
            ))}
          </div>
        ) : (
          <EmptyState message={MESSAGES.NO_PARTICIPANTS} />
        )}
      </CardContent>
    </Card>
  );
}
