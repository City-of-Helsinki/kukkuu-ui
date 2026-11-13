import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { useCmsLoadingState } from '../useCmsLoadingState';

describe('useCmsLoadingState', () => {
  it('returns isInitialLoading true when loading is true and data is undefined', () => {
    const { result } = renderHook(() =>
      useCmsLoadingState({ loading: true, data: undefined })
    );
    expect(result.current.isInitialLoading).toBe(true);
    expect(result.current.hasError).toBe(false);
  });

  it('returns isInitialLoading true when loading is true and data is null', () => {
    const { result } = renderHook(() =>
      useCmsLoadingState({ loading: true, data: null })
    );
    expect(result.current.isInitialLoading).toBe(true);
    expect(result.current.hasError).toBe(false);
  });

  it('returns isInitialLoading false during background revalidation (loading true, data exists)', () => {
    const { result } = renderHook(() =>
      useCmsLoadingState({ loading: true, data: { page: { id: '123' } } })
    );
    expect(result.current.isInitialLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  it('returns isInitialLoading false when loading has completed', () => {
    const { result } = renderHook(() =>
      useCmsLoadingState({
        loading: false,
        data: { page: { id: '123' } },
        error: undefined,
      })
    );
    expect(result.current.isInitialLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  it('identifies error state when error is present', () => {
    const { result } = renderHook(() =>
      useCmsLoadingState({
        loading: false,
        data: undefined,
        error: new Error('Network error'),
      })
    );
    expect(result.current.isInitialLoading).toBe(false);
    expect(result.current.hasError).toBe(true);
  });
});
