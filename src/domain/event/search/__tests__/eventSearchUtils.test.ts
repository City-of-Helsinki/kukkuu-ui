import { describe, expect, it } from 'vitest';

import {
  DEFAULT_SEARCH_FILTERS,
  EVENT_SEARCH_FILTER_KEYS,
  extractSearchEvents,
  getEventLanguageText,
  getEventOccurrencesSummary,
  getEventTimeText,
  getEventVenueText,
  hasActiveFilters,
  isFilterActive,
  parseSearchFiltersFromUrl,
  writeSearchFiltersToUrlParams,
} from '../eventSearchUtils';
import type { AvailableEvent } from '../../types/EventsSearchTypes';
import {
  fakeAvailableEvent,
  fakeAvailableOccurrence,
} from '../../../../utils/eventMockDataUtils';

describe('eventSearchUtils', () => {
  describe('extractSearchEvents', () => {
    it('returns empty array when events connection or edges are missing', () => {
      expect(extractSearchEvents(null)).toEqual([]);
      expect(extractSearchEvents(undefined)).toEqual([]);
      expect(
        extractSearchEvents({
          count: 0,
          pageInfo: { hasNextPage: false, endCursor: null },
          edges: [],
        })
      ).toEqual([]);
    });

    it('extracts non-null event nodes in server-returned order', () => {
      const event1 = fakeAvailableEvent({ id: 'ev-1', name: 'Event 1' });
      const event2 = fakeAvailableEvent({ id: 'ev-2', name: 'Event 2' });

      const extracted = extractSearchEvents({
        count: 2,
        pageInfo: { hasNextPage: false, endCursor: 'cursor-2' },
        edges: [
          null,
          { cursor: 'cursor-1', node: event1 },
          { cursor: 'cursor-null', node: null },
          { cursor: 'cursor-2', node: event2 },
        ],
      });

      expect(extracted.map((e) => e.id)).toEqual(['ev-1', 'ev-2']);
    });
  });

  describe('getEventOccurrencesSummary & text getters', () => {
    const mockT = ((key: string, options?: any) => {
      if (key === 'search.card.dateRangeWithCount') {
        return `${options.dateRange} (${options.count} tapahtuma-aikaa)`;
      }
      if (key.startsWith('common.language.')) {
        return key.replace('common.language.', '');
      }
      if (key === 'search.card.languages') {
        return `Kielet: ${options.languages}`;
      }
      if (key === 'common.dateTimeSeparator') {
        return 'klo';
      }
      return key;
    }) as any;

    const multiOccEvent = fakeAvailableEvent({
      id: 'ev-multi',
      name: 'Multi Occ Event',
      occurrences: {
        edges: [
          {
            node: fakeAvailableOccurrence({
              id: 'occ-1',
              time: '2026-10-05T10:00:00Z',
              remainingCapacity: 5,
              occurrenceLanguage: 'FI' as any,
              venue: { id: 'v1', name: 'Venue 1', address: 'Street 1' },
            }),
          },
          {
            node: fakeAvailableOccurrence({
              id: 'occ-2',
              time: '2026-10-12T12:00:00Z',
              remainingCapacity: 2,
              occurrenceLanguage: 'SV' as any,
              venue: { id: 'v2', name: 'Venue 2', address: 'Street 2' },
            }),
          },
        ],
      },
    });

    it('computes summary with count, unique venues, and unique languages', () => {
      const summary = getEventOccurrencesSummary(multiOccEvent);
      expect(summary.count).toBe(2);
      expect(summary.firstOccurrence?.id).toBe('occ-1');
      expect(summary.lastOccurrence?.id).toBe('occ-2');
      expect(summary.uniqueVenues).toHaveLength(2);
      expect(summary.uniqueLanguages).toEqual(['fi', 'sv']);
    });

    it('formats date range with count for multiple occurrences', () => {
      const timeText = getEventTimeText(multiOccEvent, mockT, 'fi');
      expect(timeText).toContain('5.10.2026 – 12.10.2026');
      expect(timeText).toContain('2 tapahtuma-aikaa');
    });

    it('formats single date and time range for single occurrence', () => {
      const singleOccEvent: AvailableEvent = {
        ...multiOccEvent,
        occurrences: {
          edges: [multiOccEvent.occurrences.edges[0]],
        },
      };
      const timeText = getEventTimeText(singleOccEvent, mockT, 'fi');
      expect(timeText).toBe('Ma 5.10.2026 klo 13:00–14:00'); // Europe/Helsinki UTC+3
    });

    it('returns null for event with zero occurrences', () => {
      const emptyOccEvent: AvailableEvent = {
        ...multiOccEvent,
        occurrences: { edges: [] },
      };
      expect(getEventTimeText(emptyOccEvent, mockT, 'fi')).toBeNull();
      expect(getEventVenueText(emptyOccEvent)).toBeNull();
      expect(getEventLanguageText(emptyOccEvent, mockT)).toBeNull();
    });

    it('formats venue text for single vs multiple venues', () => {
      const firstOccNode = multiOccEvent.occurrences.edges[0]?.node;
      const singleVenueEvent: AvailableEvent = {
        ...multiOccEvent,
        occurrences: {
          edges: [
            multiOccEvent.occurrences.edges[0],
            {
              node: {
                ...(firstOccNode || {}),
                id: 'occ-1-copy',
              } as any,
            },
          ],
        },
      };
      expect(getEventVenueText(singleVenueEvent)).toBe('Venue 1, Street 1');
      expect(getEventVenueText(multiOccEvent)).toBe('Venue 1, Venue 2');
    });

    it('formats unique languages list', () => {
      expect(getEventLanguageText(multiOccEvent, mockT)).toBe('Kielet: fi, sv');
    });
  });

  describe('filter presence and active state utilities', () => {
    it('defines all canonical search filter keys in EVENT_SEARCH_FILTER_KEYS', () => {
      expect([...EVENT_SEARCH_FILTER_KEYS].sort()).toEqual([
        'accessibility',
        'availableOnly',
        'familyOnly',
        'languages',
        'startDate',
        'themePaths',
      ]);
    });

    it('identifies whether an individual filter category is active', () => {
      expect(isFilterActive(DEFAULT_SEARCH_FILTERS, 'themePaths')).toBe(false);
      expect(isFilterActive(DEFAULT_SEARCH_FILTERS, 'startDate')).toBe(false);
      expect(isFilterActive(DEFAULT_SEARCH_FILTERS, 'availableOnly')).toBe(false);

      expect(
        isFilterActive(
          { ...DEFAULT_SEARCH_FILTERS, themePaths: ['rytmi'] },
          'themePaths'
        )
      ).toBe(true);

      expect(
        isFilterActive(
          { ...DEFAULT_SEARCH_FILTERS, startDate: '25.11.2026' },
          'startDate'
        )
      ).toBe(true);

      expect(
        isFilterActive(
          { ...DEFAULT_SEARCH_FILTERS, availableOnly: true },
          'availableOnly'
        )
      ).toBe(true);
    });

    it('detects whether any filter category is active via hasActiveFilters', () => {
      expect(hasActiveFilters(DEFAULT_SEARCH_FILTERS)).toBe(false);

      expect(
        hasActiveFilters({
          ...DEFAULT_SEARCH_FILTERS,
          familyOnly: true,
        })
      ).toBe(true);
    });
  });

  describe('search filters URL serialization and parsing', () => {
    it('parses and writes search filters to URLSearchParams', () => {
      const params = new URLSearchParams(
        'child=child-1&themePath=rytmi&themePath=tarina&startDate=2026-11-25&accessibility=sensory&language=fi&availableOnly=true&familyOnly=true'
      );

      const filters = parseSearchFiltersFromUrl(params);
      expect(filters.themePaths).toEqual(['rytmi', 'tarina']);
      expect(filters.startDate).toBe('25.11.2026');
      expect(filters.accessibility).toEqual(['sensory']);
      expect(filters.languages).toEqual(['fi']);
      expect(filters.availableOnly).toBe(true);
      expect(filters.familyOnly).toBe(true);

      const nextParams = new URLSearchParams();
      writeSearchFiltersToUrlParams(nextParams, 'child-1', filters);
      expect(nextParams.get('child')).toBe('child-1');
      expect(nextParams.getAll('themePath')).toEqual(['rytmi', 'tarina']);
      expect(nextParams.get('startDate')).toBe('2026-11-25');
      expect(nextParams.getAll('accessibility')).toEqual(['sensory']);
      expect(nextParams.getAll('language')).toEqual(['fi']);
      expect(nextParams.get('availableOnly')).toBe('true');
      expect(nextParams.get('familyOnly')).toBe('true');
    });
  });
});
