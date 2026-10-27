import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useEventLanguages } from '../useEventLanguages';

describe('useEventLanguages', () => {
  it('returns selected occurrence language when present', () => {
    const selected = { occurrenceLanguage: 'FI' };
    const others = [{ occurrenceLanguage: 'SV' }];

    const { result } = renderHook(() => useEventLanguages(selected, others));

    expect(result.current.uniqueLanguages).toEqual(['fi']);
    expect(result.current.languageText).toBeTruthy();
  });

  it('deduplicates language codes across occurrences list when no selected occurrence', () => {
    const occurrences = [
      { occurrenceLanguage: 'FI' },
      { occurrenceLanguage: 'fi' },
      { occurrenceLanguage: 'SV' },
    ];

    const { result } = renderHook(() => useEventLanguages(null, occurrences));

    expect(result.current.uniqueLanguages).toEqual(['fi', 'sv']);
    expect(result.current.languageText).toContain(',');
  });

  it('returns empty array and null text when no languages are present', () => {
    const { result } = renderHook(() => useEventLanguages(null, []));

    expect(result.current.uniqueLanguages).toEqual([]);
    expect(result.current.languageText).toBeNull();
  });
});

