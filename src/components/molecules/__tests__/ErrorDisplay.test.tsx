import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorDisplay } from '../ErrorDisplay';

describe('ErrorDisplay', () => {
  it('should render error message', () => {
    const message = 'Test error message';
    render(<ErrorDisplay message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('should render with default props when no props provided', () => {
    render(<ErrorDisplay />);
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });
});
