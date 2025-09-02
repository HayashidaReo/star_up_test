'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '@/store/useAppStore';
import { Plus, X } from 'lucide-react';

export function ParticipantsSection() {
  const [newParticipantName, setNewParticipantName] = useState('');
  const { participants, addParticipant, removeParticipant } = useAppStore();

  // 参加者を追加する関数
  const handleAddParticipant = () => {
    if (newParticipantName.trim()) {
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

  // 参加者のイニシャルを取得する関数
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
            placeholder="名前を入力..."
            value={newParticipantName}
            onChange={(e) => setNewParticipantName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleAddParticipant}
            disabled={!newParticipantName.trim()}
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" />
            追加
          </Button>
        </div>

        {/* 参加者リスト */}
        {participants.length > 0 ? (
          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-sm">
                      {getInitials(participant.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{participant.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParticipant(participant.id)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            参加者を追加してください
          </div>
        )}
      </CardContent>
    </Card>
  );
}
