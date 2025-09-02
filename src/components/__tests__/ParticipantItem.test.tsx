import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test-utils';
import { ParticipantItem } from '../ParticipantItem';
import { Participant } from '@/types';

describe('ParticipantItem', () => {
  const mockParticipant: Participant = {
    id: '1',
    name: 'John Doe',
  };

  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render participant name', () => {
    render(
      <ParticipantItem
        participant={mockParticipant}
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render participant initials in avatar', () => {
    render(
      <ParticipantItem
        participant={mockParticipant}
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should call onRemove when remove button is clicked', () => {
    render(
      <ParticipantItem
        participant={mockParticipant}
        onRemove={mockOnRemove}
      />
    );
    
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);
    
    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });

  it('should handle single name initials', () => {
    const singleNameParticipant: Participant = {
      id: '2',
      name: 'Alice',
    };

    render(
      <ParticipantItem
        participant={singleNameParticipant}
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should handle multiple word names', () => {
    const multiWordParticipant: Participant = {
      id: '3',
      name: 'John Michael Smith',
    };

    render(
      <ParticipantItem
        participant={multiWordParticipant}
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('JM')).toBeInTheDocument();
  });
});
