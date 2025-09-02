import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useErrorHandler } from '../useErrorHandler';

describe('useErrorHandler', () => {
  it('should be defined', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current).toBeDefined();
  });
});
