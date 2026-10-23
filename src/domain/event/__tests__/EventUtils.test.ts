import {
  extractUniqueLanguages,
  extractUniqueVenues,
  findEnrolledOccurrence,
  formatDuration,
  formatOccurrenceTime,
  sortOccurrencesByTime,
} from '../EventUtils';

// NOTE: After upgrade in KK-1017, this date needed the Finnish timezone, but the reason is unknown.
const startTimeRaw = new Date('2020-04-25T09:34:00+03:00');
const durationMinutes = 60;

describe('EventUtils', () => {
  describe('formatOccurrenceTime', () => {
    test('should format correctly', () => {
      expect(formatOccurrenceTime(startTimeRaw, durationMinutes)).toEqual(
        '09:34 - 10:34'
      );
    });
  });

  describe('formatDuration', () => {
    test('returns null for empty or non-positive durations', () => {
      expect(formatDuration(null)).toBeNull();
      expect(formatDuration(undefined)).toBeNull();
      expect(formatDuration(0)).toBeNull();
      expect(formatDuration(-15)).toBeNull();
    });

    test('formats hours and minutes', () => {
      expect(formatDuration(90)).toEqual('1 h 30 min');
    });

    test('formats exact hours', () => {
      expect(formatDuration(60)).toEqual('1 h');
      expect(formatDuration(120)).toEqual('2 h');
    });

    test('formats minutes under an hour', () => {
      expect(formatDuration(45)).toEqual('45 min');
    });
  });

  describe('sortOccurrencesByTime', () => {
    test('sorts occurrences in ascending order by start time', () => {
      const occs = [
        { id: '2', time: '2026-10-10T12:00:00Z' },
        { id: '1', time: '2026-10-01T10:00:00Z' },
        { id: '3', time: '2026-10-20T08:00:00Z' },
      ];
      const sorted = sortOccurrencesByTime(occs);
      expect(sorted.map((o) => o.id)).toEqual(['1', '2', '3']);
    });
  });

  describe('extractUniqueVenues', () => {
    test('returns selected occurrence venue when present', () => {
      const selected = {
        venue: { id: 'v-selected', name: 'Selected Venue' },
      };
      const others = [{ venue: { id: 'v-other', name: 'Other Venue' } }];
      expect(extractUniqueVenues(selected, others)).toEqual([selected.venue]);
    });

    test('deduplicates venues from occurrences list when no selected occurrence', () => {
      const occurrences = [
        { venue: { id: 'v-1', name: 'Venue 1', address: 'Street 1' } },
        { venue: { id: 'v-1', name: 'Venue 1', address: 'Street 1' } },
        { venue: { id: 'v-2', name: 'Venue 2', address: 'Street 2' } },
      ];
      const unique = extractUniqueVenues(null, occurrences);
      expect(unique).toHaveLength(2);
      expect(unique[0].id).toBe('v-1');
      expect(unique[1].id).toBe('v-2');
    });
  });

  describe('extractUniqueLanguages', () => {
    test('returns selected occurrence language in lowercase when present', () => {
      const selected = { occurrenceLanguage: 'FI' };
      const others = [{ occurrenceLanguage: 'SV' }];
      expect(extractUniqueLanguages(selected, others)).toEqual(['fi']);
    });

    test('deduplicates language codes across occurrences list', () => {
      const occurrences = [
        { occurrenceLanguage: 'FI' },
        { occurrenceLanguage: 'fi' },
        { occurrenceLanguage: 'SV' },
      ];
      expect(extractUniqueLanguages(null, occurrences)).toEqual(['fi', 'sv']);
    });
  });

  describe('findEnrolledOccurrence', () => {
    test('finds enrolled occurrence from list or fallback', () => {
      const occurrences = [{ id: 'occ-1' }, { id: 'occ-2' }];
      expect(findEnrolledOccurrence('occ-2', occurrences)).toEqual({
        id: 'occ-2',
      });
      expect(
        findEnrolledOccurrence('occ-selected', occurrences, {
          id: 'occ-selected',
        })
      ).toEqual({ id: 'occ-selected' });
      expect(findEnrolledOccurrence('non-existent', occurrences)).toBeNull();
      expect(findEnrolledOccurrence(null, occurrences)).toBeNull();
    });
  });
});
