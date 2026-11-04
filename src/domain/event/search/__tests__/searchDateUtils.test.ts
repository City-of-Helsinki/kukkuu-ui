import { describe, expect, it } from 'vitest';

import {
  createValidDate,
  formatFinnishDateToIso,
  formatIsoDateToFinnish,
  parseFilterStartDate,
  parseFinnishDate,
  parseIsoDate,
} from '../searchDateUtils';

describe('searchDateUtils', () => {
  describe('createValidDate', () => {
    it.each([
      {
        year: 2024,
        monthIndex: 1,
        day: 29,
        desc: 'leap day (2024-02-29)',
      },
      {
        year: 2026,
        monthIndex: 10,
        day: 25,
        desc: 'standard date (2026-11-25)',
      },
    ])(
      'creates valid Date object for $desc',
      ({ year, monthIndex, day }) => {
        const result = createValidDate(year, monthIndex, day);
        expect(result).not.toBeNull();
        expect(result?.getFullYear()).toBe(year);
        expect(result?.getMonth()).toBe(monthIndex);
        expect(result?.getDate()).toBe(day);
      }
    );

    it.each([
      {
        year: 2025,
        monthIndex: 1,
        day: 29,
        desc: 'Feb 29 on non-leap year',
      },
      {
        year: 2026,
        monthIndex: 3,
        day: 31,
        desc: 'April 31 (month has 30 days)',
      },
      {
        year: 2026,
        monthIndex: 0,
        day: 32,
        desc: 'Day 32',
      },
      {
        year: 2026,
        monthIndex: 1,
        day: 0,
        desc: 'Day 0',
      },
    ])(
      'returns null for invalid calendar date: $desc',
      ({ year, monthIndex, day }) => {
        expect(createValidDate(year, monthIndex, day)).toBeNull();
      }
    );
  });

  describe('parseFinnishDate', () => {
    it.each([
      {
        input: '  25.11.2026  ',
        expected: { year: 2026, monthIndex: 10, day: 25 },
      },
      {
        input: '1.5.2026',
        expected: { year: 2026, monthIndex: 4, day: 1 },
      },
    ])('parses valid Finnish date "$input"', ({ input, expected }) => {
      const result = parseFinnishDate(input);
      expect(result).not.toBeNull();
      expect(result?.getFullYear()).toBe(expected.year);
      expect(result?.getMonth()).toBe(expected.monthIndex);
      expect(result?.getDate()).toBe(expected.day);
    });

    it.each([
      ['empty string', ''],
      ['null', null],
      ['undefined', undefined],
      ['ISO format string', '2026-11-25'],
      ['invalid date 31.02.2026', '31.02.2026'],
      ['arbitrary text', 'invalid'],
    ])('returns null for %s', (_, input) => {
      expect(parseFinnishDate(input as string)).toBeNull();
    });
  });

  describe('parseIsoDate', () => {
    it.each([
      {
        input: '  2026-11-25  ',
        expected: { year: 2026, monthIndex: 10, day: 25 },
      },
      {
        input: '2024-02-29',
        expected: { year: 2024, monthIndex: 1, day: 29 },
      },
    ])('parses valid ISO date "$input"', ({ input, expected }) => {
      const result = parseIsoDate(input);
      expect(result).not.toBeNull();
      expect(result?.getFullYear()).toBe(expected.year);
      expect(result?.getMonth()).toBe(expected.monthIndex);
      expect(result?.getDate()).toBe(expected.day);
    });

    it.each([
      ['empty string', ''],
      ['null', null],
      ['undefined', undefined],
      ['Finnish format string', '25.11.2026'],
      ['invalid leap date 2025-02-29', '2025-02-29'],
      ['invalid month 2026-13-01', '2026-13-01'],
      ['arbitrary text', 'invalid'],
    ])('returns null for %s', (_, input) => {
      expect(parseIsoDate(input as string)).toBeNull();
    });
  });

  describe('parseFilterStartDate', () => {
    it.each([
      {
        input: '25.11.2026',
        format: 'Finnish DD.MM.YYYY',
        expected: { year: 2026, monthIndex: 10, day: 25 },
      },
      {
        input: '1.5.2026',
        format: 'Finnish single-digit D.M.YYYY',
        expected: { year: 2026, monthIndex: 4, day: 1 },
      },
      {
        input: '2026-11-25',
        format: 'ISO YYYY-MM-DD',
        expected: { year: 2026, monthIndex: 10, day: 25 },
      },
      {
        input: '2024-02-29',
        format: 'ISO leap day',
        expected: { year: 2024, monthIndex: 1, day: 29 },
      },
      {
        input: '  25.11.2026  ',
        format: 'padded Finnish date',
        expected: { year: 2026, monthIndex: 10, day: 25 },
      },
    ])(
      'parses valid date "$input" ($format) correctly',
      ({ input, expected }) => {
        const result = parseFilterStartDate(input);
        expect(result).not.toBeNull();
        expect(result?.getFullYear()).toBe(expected.year);
        expect(result?.getMonth()).toBe(expected.monthIndex);
        expect(result?.getDate()).toBe(expected.day);
      }
    );

    it.each([
      ['empty string', ''],
      ['null', null],
      ['undefined', undefined],
      ['non-date string', 'not-a-date'],
      ['invalid Finnish day/month', '32.13.2026'],
      ['invalid calendar date in non-leap year', '29.02.2025'],
      ['invalid ISO month', '2026-13-01'],
      ['invalid ISO calendar date in non-leap year', '2025-02-29'],
      ['partial date string', '2026-11'],
    ])('returns null for invalid input: %s', (_, input) => {
      expect(parseFilterStartDate(input as string)).toBeNull();
    });
  });

  describe('formatIsoDateToFinnish and formatFinnishDateToIso', () => {
    it.each([
      { iso: '2026-11-25', finnish: '25.11.2026' },
      { iso: '2024-02-29', finnish: '29.02.2024' },
    ])('converts between "$iso" and "$finnish"', ({ iso, finnish }) => {
      expect(formatIsoDateToFinnish(iso)).toBe(finnish);
      expect(formatFinnishDateToIso(finnish)).toBe(iso);
    });

    it.each([
      ['empty string', ''],
      ['invalid string', 'invalid'],
      ['null', null],
      ['undefined', undefined],
    ])('returns empty string for %s', (_, input) => {
      expect(formatIsoDateToFinnish(input as string)).toBe('');
      expect(formatFinnishDateToIso(input as string)).toBe('');
    });
  });
});
