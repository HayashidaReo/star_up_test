import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('should render message correctly', () => {
    const message = 'No data available';
    render(<EmptyState message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const customClass = 'custom-class';
    render(<EmptyState message="Test" className={customClass} />);
    
    const element = screen.getByText('Test');
    expect(element).toHaveClass(customClass);
  });

  it('should have default styling classes', () => {
    render(<EmptyState message="Test" />);
    
    const element = screen.getByText('Test');
    expect(element).toHaveClass('py-8', 'text-center', 'text-gray-500');
  });
});
