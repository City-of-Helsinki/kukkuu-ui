import { describe, expect, it } from 'vitest';

import { EVENT_SEARCH_FILTER_KEYS } from '../types/filterTypes';
import {
  FILTER_URL_CONFIG,
  SEARCH_URL_PARAMS,
} from '../searchFilterUrlConfig';

describe('searchFilterUrlConfig', () => {
  it('defines a configuration for every key in EVENT_SEARCH_FILTER_KEYS', () => {
    const configKeys = Object.keys(FILTER_URL_CONFIG).sort();
    const expectedKeys = [...EVENT_SEARCH_FILTER_KEYS].sort();
    expect(configKeys).toEqual(expectedKeys);
  });

  it.each([
    'child',
    'childId',
    'themePath',
    'themePaths',
    'startDate',
    'date',
    'accessibility',
    'language',
    'languages',
    'availableOnly',
    'familyOnly',
  ])('derives SEARCH_URL_PARAMS containing "%s"', (param) => {
    expect(SEARCH_URL_PARAMS).toContain(param);
  });

  describe('themePaths', () => {
    const config = FILTER_URL_CONFIG.themePaths;

    it('parses both single, comma-separated, and repeated query parameters', () => {
      const params = new URLSearchParams('themePath=music,dance&themePaths=theater');
      const result = config.parseFromUrl(params);
      expect(result).toEqual(['music', 'dance', 'theater']);
    });

    it('filters out invalid options when validOptions are provided', () => {
      const params = new URLSearchParams('themePath=music,invalid-slug');
      const result = config.parseFromUrl(params, {
        themePaths: ['music', 'art'],
      });
      expect(result).toEqual(['music']);
    });

    it('writes repeated themePath parameters and clears legacy aliases', () => {
      const params = new URLSearchParams('themePaths=old');
      config.writeToUrl(params, ['music', 'dance']);
      expect(params.getAll('themePath')).toEqual(['music', 'dance']);
      expect(params.get('themePaths')).toBeNull();
    });
  });

  describe('startDate', () => {
    const config = FILTER_URL_CONFIG.startDate;

    it('parses ISO date from URL and converts to Finnish format', () => {
      const params = new URLSearchParams('startDate=2026-11-17');
      expect(config.parseFromUrl(params)).toBe('17.11.2026');
    });

    it('parses legacy date query parameter', () => {
      const params = new URLSearchParams('date=2026-12-01');
      expect(config.parseFromUrl(params)).toBe('01.12.2026');
    });

    it('returns empty string for invalid date values', () => {
      const params = new URLSearchParams('startDate=invalid-date');
      expect(config.parseFromUrl(params)).toBe('');
    });

    it('writes Finnish date as ISO formatted startDate parameter', () => {
      const params = new URLSearchParams('date=old');
      config.writeToUrl(params, '17.11.2026');
      expect(params.get('startDate')).toBe('2026-11-17');
      expect(params.get('date')).toBeNull();
    });

    it('clears startDate parameter when date value is empty', () => {
      const params = new URLSearchParams('startDate=2026-11-17');
      config.writeToUrl(params, '');
      expect(params.get('startDate')).toBeNull();
    });
  });

  describe('accessibility', () => {
    const config = FILTER_URL_CONFIG.accessibility;

    it('parses accessibility items from URL', () => {
      const params = new URLSearchParams('accessibility=wheelchair,audio-guide');
      expect(config.parseFromUrl(params)).toEqual(['wheelchair', 'audio-guide']);
    });

    it('filters out unsupported accessibility options when validOptions provided', () => {
      const params = new URLSearchParams('accessibility=wheelchair,unsupported');
      const result = config.parseFromUrl(params, {
        accessibility: ['wheelchair'],
      });
      expect(result).toEqual(['wheelchair']);
    });

    it('writes repeated accessibility parameters', () => {
      const params = new URLSearchParams();
      config.writeToUrl(params, ['wheelchair', 'elevator']);
      expect(params.getAll('accessibility')).toEqual(['wheelchair', 'elevator']);
    });
  });

  describe('languages', () => {
    const config = FILTER_URL_CONFIG.languages;

    it('parses language parameters into lowercase list', () => {
      const params = new URLSearchParams('language=FI&languages=EN,SV');
      expect(config.parseFromUrl(params)).toEqual(['fi', 'en', 'sv']);
    });

    it('writes repeated language parameters and deletes alias', () => {
      const params = new URLSearchParams('languages=old');
      config.writeToUrl(params, ['FI', 'SV']);
      expect(params.getAll('language')).toEqual(['fi', 'sv']);
      expect(params.get('languages')).toBeNull();
    });
  });

  describe('availableOnly and familyOnly', () => {
    it('parses boolean true from "true" string and false otherwise', () => {
      expect(
        FILTER_URL_CONFIG.availableOnly.parseFromUrl(
          new URLSearchParams('availableOnly=true')
        )
      ).toBe(true);
      expect(
        FILTER_URL_CONFIG.availableOnly.parseFromUrl(
          new URLSearchParams('availableOnly=false')
        )
      ).toBe(false);
      expect(
        FILTER_URL_CONFIG.availableOnly.parseFromUrl(new URLSearchParams())
      ).toBe(false);

      expect(
        FILTER_URL_CONFIG.familyOnly.parseFromUrl(
          new URLSearchParams('familyOnly=true')
        )
      ).toBe(true);
      expect(
        FILTER_URL_CONFIG.familyOnly.parseFromUrl(
          new URLSearchParams('familyOnly=anything')
        )
      ).toBe(false);
    });

    it.each(['availableOnly', 'familyOnly'] as const)(
      'writes "true" to URL when true and removes parameter when false for %s',
      (key) => {
        const config = FILTER_URL_CONFIG[key];
        const params = new URLSearchParams();

        config.writeToUrl(params, true);
        expect(params.get(config.paramName)).toBe('true');

        config.writeToUrl(params, false);
        expect(params.get(config.paramName)).toBeNull();
      }
    );
  });

  describe('isActive evaluation', () => {
    it.each([
      { key: 'themePaths', value: [], expected: false },
      { key: 'themePaths', value: ['music'], expected: true },
      { key: 'startDate', value: '', expected: false },
      { key: 'startDate', value: '   ', expected: false },
      { key: 'startDate', value: '17.11.2026', expected: true },
      { key: 'accessibility', value: [], expected: false },
      { key: 'accessibility', value: ['wheelchair'], expected: true },
      { key: 'languages', value: [], expected: false },
      { key: 'languages', value: ['fi'], expected: true },
      { key: 'availableOnly', value: false, expected: false },
      { key: 'availableOnly', value: true, expected: true },
      { key: 'familyOnly', value: false, expected: false },
      { key: 'familyOnly', value: true, expected: true },
    ] as const)(
      'evaluates isActive for $key with value $value as $expected',
      ({ key, value, expected }) => {
        const config = FILTER_URL_CONFIG[key];
        expect(config.isActive(value as never)).toBe(expected);
      }
    );
  });
});
