import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../atoms/select';
import { Participant } from '@/types';

interface ParticipantSelectProps {
  participants: Participant[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

/**
 * 参加者選択用のコンポーネント
 */
export function ParticipantSelect({
  participants,
  value,
  onValueChange,
  placeholder = '参加者を選択',
}: ParticipantSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {participants.map((participant) => (
          <SelectItem
            key={participant.id}
            value={participant.id}
            title={participant.name}
          >
            {participant.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
