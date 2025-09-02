import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { ParticipantsSection } from '../ParticipantsSection';
import { resetStore } from '@/test-utils';

// Zustandストアをモック
vi.mock('@/store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

describe('ParticipantsSection', () => {
  const mockStore = {
    participants: [],
    addParticipant: vi.fn(),
    removeParticipant: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
    
    // モックストアを設定
    const { useAppStore } = require('@/store/useAppStore');
    useAppStore.mockReturnValue(mockStore);
  });

  it('should render empty state when no participants', () => {
    render(<ParticipantsSection />);
    
    expect(screen.getByText('参加者を追加してください')).toBeInTheDocument();
  });

  it('should render participants list', () => {
    mockStore.participants = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ];

    render(<ParticipantsSection />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('should add participant when form is submitted', async () => {
    render(<ParticipantsSection />);
    
    const input = screen.getByPlaceholderText('名前を入力...');
    const addButton = screen.getByText('追加');
    
    fireEvent.change(input, { target: { value: 'Charlie' } });
    fireEvent.click(addButton);
    
    expect(mockStore.addParticipant).toHaveBeenCalledWith('Charlie');
  });

  it('should add participant when Enter key is pressed', async () => {
    render(<ParticipantsSection />);
    
    const input = screen.getByPlaceholderText('名前を入力...');
    
    fireEvent.change(input, { target: { value: 'David' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockStore.addParticipant).toHaveBeenCalledWith('David');
  });

  it('should not add participant with empty name', () => {
    render(<ParticipantsSection />);
    
    const addButton = screen.getByText('追加');
    
    expect(addButton).toBeDisabled();
  });

  it('should not add participant with whitespace only name', () => {
    render(<ParticipantsSection />);
    
    const input = screen.getByPlaceholderText('名前を入力...');
    const addButton = screen.getByText('追加');
    
    fireEvent.change(input, { target: { value: '   ' } });
    
    expect(addButton).toBeDisabled();
  });

  it('should clear input after adding participant', async () => {
    render(<ParticipantsSection />);
    
    const input = screen.getByPlaceholderText('名前を入力...') as HTMLInputElement;
    const addButton = screen.getByText('追加');
    
    fireEvent.change(input, { target: { value: 'Eve' } });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});
