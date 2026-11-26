import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useEventLanguages } from '../useEventLanguages';

describe('useEventLanguages', () => {
  it('returns selected occurrence language when present', () => {
    const selected = { languages: [{ alpha3Code: 'fin', name: 'suomi' }] };
    const others = [{ languages: [{ alpha3Code: 'swe', name: 'ruotsi' }] }];

    const { result } = renderHook(() => useEventLanguages(selected, others));

    expect(result.current.uniqueLanguages).toEqual(['fin']);
    expect(result.current.languageText).toBeTruthy();
  });

  it('deduplicates language codes across occurrences list when no selected occurrence', () => {
    const occurrences = [
      { languages: [{ alpha3Code: 'FIN', name: 'suomi' }] },
      { languages: [{ alpha3Code: 'fin', name: 'suomi' }] },
      { languages: [{ alpha3Code: 'swe', name: 'ruotsi' }] },
    ];

    const { result } = renderHook(() => useEventLanguages(null, occurrences));

    expect(result.current.uniqueLanguages).toEqual(['fin', 'swe']);
    expect(result.current.languageText).toContain(',');
  });

  it('returns empty array and null text when no languages are present', () => {
    const { result } = renderHook(() => useEventLanguages(null, []));

    expect(result.current.uniqueLanguages).toEqual([]);
    expect(result.current.languageText).toBeNull();
  });
});

