import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useOccurrenceCapacityText } from '../useOccurrenceCapacityText';

describe('useOccurrenceCapacityText', () => {
  it('formats remaining capacity as a ratio when capacityPerOccurrence is known', () => {
    const { result } = renderHook(() => useOccurrenceCapacityText(10));
    const format = result.current;

    expect(format(5)).toBe('5/10');
    expect(format(0)).toBe('0/10');
    expect(format(null)).toBe('0/10');
    expect(format(undefined)).toBe('0/10');
  });

  it('formats as unlimited when remaining is null or undefined and capacityPerOccurrence is not known', () => {
    const { result } = renderHook(() => useOccurrenceCapacityText(undefined));
    const format = result.current;

    expect(format(null)).toBeTruthy();
    expect(format(undefined)).toBeTruthy();
  });

  it('formats as remaining count when capacityPerOccurrence is not known but remaining is provided', () => {
    const { result } = renderHook(() => useOccurrenceCapacityText(null));
    const format = result.current;

    const formatted = format(3);
    expect(formatted).toContain('3');
  });
});

