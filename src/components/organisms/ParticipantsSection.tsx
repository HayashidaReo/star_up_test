'use client';

import React, { useState } from 'react';
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
import { useAppStore } from '@/store/useAppStore';
import { Plus } from 'lucide-react';
import { PLACEHOLDERS, MESSAGES } from '@/lib/constants';
import { isValidString } from '@/lib/utils';

export function ParticipantsSection() {
  const [newParticipantName, setNewParticipantName] = useState('');
  const { participants, addParticipant, removeParticipant } = useAppStore();

  // 参加者を追加する関数
  const handleAddParticipant = () => {
    if (isValidString(newParticipantName)) {
      addParticipant(newParticipantName);
      setNewParticipantName(''); // 入力フィールドをクリア
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
        <div className="flex gap-2">
          <Input
            placeholder={PLACEHOLDERS.PARTICIPANT_NAME}
            value={newParticipantName}
            onChange={(e) => setNewParticipantName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleAddParticipant}
            disabled={!isValidString(newParticipantName)}
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" />
            {MESSAGES.ADD_PARTICIPANT}
          </Button>
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
