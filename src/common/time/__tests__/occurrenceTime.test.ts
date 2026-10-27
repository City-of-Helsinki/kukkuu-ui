import { describe, expect, it } from 'vitest';

import {
  formatOccurrenceDateLong,
  formatOccurrenceDateRange,
  formatOccurrenceTimeRange,
  getDateBadgeParts,
  getOccurrenceEndTime,
} from '../occurrenceTime';

describe('occurrenceTime utils', () => {
  describe('getOccurrenceEndTime', () => {
    it('returns null when duration is missing or zero', () => {
      expect(getOccurrenceEndTime('2026-10-04T10:00:00Z', undefined)).toBeNull();
      expect(getOccurrenceEndTime('2026-10-04T10:00:00Z', null)).toBeNull();
      expect(getOccurrenceEndTime('2026-10-04T10:00:00Z', 0)).toBeNull();
    });

    it('returns Date with added duration minutes', () => {
      const endTime = getOccurrenceEndTime('2026-10-04T10:00:00Z', 90);
      expect(endTime).not.toBeNull();
      expect(endTime?.toISOString()).toBe('2026-10-04T11:30:00.000Z');
    });
  });

  describe('formatOccurrenceTimeRange', () => {
    it('returns only start time when duration is missing', () => {
      // 10:00 UTC = 13:00 Helsinki (EEST)
      const formatted = formatOccurrenceTimeRange('2026-10-04T10:00:00Z');
      expect(formatted).toBe('13:00');
    });

    it('returns start and end time range with en-dash when duration is given', () => {
      const formatted = formatOccurrenceTimeRange('2026-10-04T10:00:00Z', 90);
      expect(formatted).toBe('13:00–14:30');
    });
  });

  describe('formatOccurrenceDateLong', () => {
    it('formats long date with capitalized weekday in Finnish', () => {
      const formatted = formatOccurrenceDateLong('2026-10-04T10:00:00Z', 'fi');
      expect(formatted).toBe('Su 4.10.2026');
    });

    it('respects Helsinki timezone across midnight boundary', () => {
      // 22:30 UTC on Oct 4 is 01:30 on Oct 5 in Helsinki
      const formatted = formatOccurrenceDateLong('2026-10-04T22:30:00Z', 'fi');
      expect(formatted).toBe('Ma 5.10.2026');
    });
  });

  describe('formatOccurrenceDateRange', () => {
    it('returns single date when start and end occur on the same day', () => {
      const formatted = formatOccurrenceDateRange(
        '2026-10-04T10:00:00Z',
        '2026-10-04T14:00:00Z'
      );
      expect(formatted).toBe('4.10.2026');
    });

    it('returns date range separated by en-dash when dates differ', () => {
      const formatted = formatOccurrenceDateRange(
        '2026-10-04T10:00:00Z',
        '2026-10-18T10:00:00Z'
      );
      expect(formatted).toBe('4.10.2026 – 18.10.2026');
    });
  });

  describe('getDateBadgeParts', () => {
    it('returns uppercase weekday, numeric day, and lowercase nominative month', () => {
      const parts = getDateBadgeParts('2026-10-04T10:00:00Z', 'fi');
      expect(parts).toEqual({
        weekday: 'SU',
        day: 4,
        month: 'lokakuu',
      });
    });

    it('correctly shifts date across midnight boundary in Helsinki timezone', () => {
      const parts = getDateBadgeParts('2026-10-04T22:30:00Z', 'fi');
      expect(parts).toEqual({
        weekday: 'MA',
        day: 5,
        month: 'lokakuu',
      });
    });
  });
});
