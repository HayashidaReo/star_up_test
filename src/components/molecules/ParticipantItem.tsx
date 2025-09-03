import React from 'react';
import { Avatar, AvatarFallback } from '@/components/atoms/avatar';
import { Button } from '@/components/atoms/button';
import { X } from 'lucide-react';
import { Participant } from '@/types';
import { getInitials } from '@/lib/utils';

interface ParticipantItemProps {
  participant: Participant;
  onRemove: (id: string) => void;
}

/**
 * 参加者リストのアイテムコンポーネント
 */
export function ParticipantItem({
  participant,
  onRemove,
}: ParticipantItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50">
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
        onClick={() => onRemove(participant.id)}
        className="text-red-500 hover:bg-red-50 hover:text-red-700"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
