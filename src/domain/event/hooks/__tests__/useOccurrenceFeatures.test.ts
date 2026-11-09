import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';

import {
  formatOccurrenceLanguages,
  getOccurrenceAccessibilities,
  getOccurrenceLanguages,
  isSpeechless,
  useOccurrenceFeatures,
} from '../useOccurrenceFeatures';

describe('useOccurrenceFeatures', () => {
  describe('getOccurrenceLanguages', () => {
    it('returns empty array when occurrence is null or undefined', () => {
      expect(getOccurrenceLanguages(null)).toEqual([]);
      expect(getOccurrenceLanguages(undefined)).toEqual([]);
    });

    it('returns occurrenceLanguage parsed as an array', () => {
      expect(
        getOccurrenceLanguages({
          occurrenceLanguage: 'FI, SV, EN',
        })
      ).toEqual(['FI', 'SV', 'EN']);
    });

    it('falls back to single occurrenceLanguage wrapped in an array', () => {
      expect(getOccurrenceLanguages({ occurrenceLanguage: 'FI' })).toEqual([
        'FI',
      ]);
    });

    it('returns empty array if no languages are present', () => {
      expect(getOccurrenceLanguages({})).toEqual([]);
    });
  });

  describe('getOccurrenceAccessibilities', () => {
    it('returns empty array when missing or null', () => {
      expect(getOccurrenceAccessibilities(null)).toEqual([]);
      expect(getOccurrenceAccessibilities({})).toEqual([]);
      expect(getOccurrenceAccessibilities({ accessibilities: null })).toEqual(
        []
      );
    });

    it('returns accessibilities list when present', () => {
      const items = ['Yliaistiherkkyys', 'Lorem ipsum'];
      expect(getOccurrenceAccessibilities({ accessibilities: items })).toEqual(
        items
      );
    });
  });

  describe('isSpeechless', () => {
    it('detects "sanaton" case-insensitively', () => {
      expect(isSpeechless(['Suomi', 'sanaton'])).toBe(true);
      expect(isSpeechless(['Sanaton', 'Ruotsi'])).toBe(true);
      expect(isSpeechless(['SANATON'])).toBe(true);
    });

    it('returns false when "sanaton" is not present', () => {
      expect(isSpeechless(['Suomi', 'Ruotsi'])).toBe(false);
      expect(isSpeechless([])).toBe(false);
    });
  });

  describe('formatOccurrenceLanguages', () => {
    it('returns dash when list is empty', () => {
      const mockT = ((key: string, def?: string) => def ?? key) as any;
      expect(formatOccurrenceLanguages([], mockT)).toBe('–');
    });

    it('formats languages comma-separated with localization', () => {
      const mockT = ((key: string, def?: string) => {
        if (key === 'common.language.fi') return 'Suomi';
        if (key === 'common.language.sv') return 'Ruotsi';
        if (key === 'common.language.sanaton') return 'Sanaton';
        return def ?? key;
      }) as any;

      expect(formatOccurrenceLanguages(['FI', 'SV', 'sanaton'], mockT)).toBe(
        'Suomi, Ruotsi, Sanaton'
      );
    });
  });

  describe('useOccurrenceFeatures hook', () => {
    it('returns resolved features for an occurrence', () => {
      const { result } = renderHook(() =>
        useOccurrenceFeatures({
          occurrenceLanguage: 'FI, sanaton',
          accessibilities: ['Pyörätuoliystävällinen'],
        })
      );

      expect(result.current.languages).toEqual(['FI', 'sanaton']);
      expect(result.current.isSpeechless).toBe(true);
      expect(result.current.accessibilities).toEqual([
        'Pyörätuoliystävällinen',
      ]);
      expect(result.current.hasAccessibilities).toBe(true);
      expect(result.current.languageText).toBeTruthy();
    });
  });
});
