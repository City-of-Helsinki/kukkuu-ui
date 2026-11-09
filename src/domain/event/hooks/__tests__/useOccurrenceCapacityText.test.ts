import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useOccurrenceCapacityText } from '../useOccurrenceCapacityText';

describe('useOccurrenceCapacityText', () => {
  it('returns plain remaining capacity as a string when remaining is a number', () => {
    const { result } = renderHook(() => useOccurrenceCapacityText());
    const formatCapacity = result.current;

    expect(formatCapacity(10)).toBe('10');
    expect(formatCapacity(0)).toBe('0');
    expect(formatCapacity(66)).toBe('66');
  });

  it('returns unlimited text when remaining is undefined', () => {
    const { result } = renderHook(() => useOccurrenceCapacityText());
    const formatCapacity = result.current;

    expect(formatCapacity(undefined)).toBe('Ei rajoitusta');
  });

  it('returns unlimited text when remaining is null', () => {
    const { result } = renderHook(() => useOccurrenceCapacityText());
    const formatCapacity = result.current;

    expect(formatCapacity(null)).toBe('Ei rajoitusta');
  });
});
