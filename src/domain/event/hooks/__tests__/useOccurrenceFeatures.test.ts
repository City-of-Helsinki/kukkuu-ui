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

    it('returns language codes from languages array', () => {
      expect(
        getOccurrenceLanguages({
          languages: [
            { alpha3Code: 'fin', name: 'suomi' },
            { alpha3Code: 'swe', name: 'ruotsi' },
            { alpha3Code: 'eng', name: 'englanti' },
          ],
        })
      ).toEqual(['fin', 'swe', 'eng']);
    });

    it('falls back to single language wrapped in an array', () => {
      expect(
        getOccurrenceLanguages({
          languages: [{ alpha3Code: 'fin', name: 'suomi' }],
        })
      ).toEqual(['fin']);
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

    it('returns sorted accessibility names from AccessibilityNode items', () => {
      const items = [
        { id: 'acc-3', slug: 'mobility', name: 'Liikkumisrajoitteet', sortOrder: null },
        { id: 'acc-2', slug: 'hearing', name: 'Kuulemisen tuki', sortOrder: 4 },
        { id: 'acc-1', slug: 'sensory_sensitivity', name: 'Aistiherkkyys', sortOrder: 1 },
      ];
      expect(getOccurrenceAccessibilities({ accessibilities: items })).toEqual([
        'Aistiherkkyys',
        'Kuulemisen tuki',
        'Liikkumisrajoitteet',
      ]);
    });
  });

  describe('isSpeechless', () => {
    it('detects "zxx" (ISO 639-2/639-3 code) and "sanaton" case-insensitively', () => {
      expect(isSpeechless(['FI', 'zxx'])).toBe(true);
      expect(isSpeechless(['ZXX'])).toBe(true);
      expect(isSpeechless(['Suomi', 'sanaton'])).toBe(true);
      expect(isSpeechless(['Sanaton', 'Ruotsi'])).toBe(true);
      expect(isSpeechless(['SANATON'])).toBe(true);
    });

    it('returns false when neither "zxx" nor "sanaton" is present', () => {
      expect(isSpeechless(['Suomi', 'Ruotsi'])).toBe(false);
      expect(isSpeechless(['FI', 'SV', 'EN'])).toBe(false);
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
          languages: [
            { alpha3Code: 'fin', name: 'suomi' },
            { alpha3Code: 'zxx', name: 'Sanaton' },
          ],
          accessibilities: [
            {
              id: 'acc-1',
              slug: 'mobility',
              name: 'Pyörätuoliystävällinen',
              sortOrder: 1,
            },
          ],
        })
      );

      expect(result.current.languages).toEqual(['fin', 'zxx']);
      expect(result.current.isSpeechless).toBe(true);
      expect(result.current.accessibilities).toEqual([
        'Pyörätuoliystävällinen',
      ]);
      expect(result.current.hasAccessibilities).toBe(true);
      expect(result.current.languageText).toBeTruthy();
    });
  });
});
