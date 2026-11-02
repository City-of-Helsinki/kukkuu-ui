import { describe, expect, it } from 'vitest';

import {
  createValidDate,
  DEFAULT_SEARCH_FILTERS,
  doesOccurrenceMatchFilters,
  EVENT_SEARCH_FILTER_KEYS,
  extractAvailableEvents,
  filterAvailableEvents,
  formatFinnishDateToIso,
  formatIsoDateToFinnish,
  getEventLanguageText,
  getEventOccurrencesSummary,
  getEventTimeText,
  getEventVenueText,
  hasActiveFilters,
  isEventEligible,
  isEventNotFull,
  isFilterActive,
  parseFilterStartDate,
  parseFinnishDate,
  parseIsoDate,
  parseSearchFiltersFromUrl,
  sortEventsByEarliestOccurrence,
  writeSearchFiltersToUrlParams,
} from '../eventSearchUtils';
import {
  EventParticipantsPerInvite,
  Language,
} from '../../../api/generatedTypes/graphql';
import type { AvailableEvent } from '../../types/ChildAvailableOccurrencesTypes';
import {
  fakeAvailableEvent,
  fakeAvailableOccurrence,
} from '../../../../utils/eventMockDataUtils';

describe('eventSearchUtils', () => {
  describe('extractAvailableEvents', () => {
    it('returns empty array when child or availableEvents is missing', () => {
      expect(extractAvailableEvents(null)).toEqual([]);
      expect(extractAvailableEvents(undefined)).toEqual([]);
      expect(
        extractAvailableEvents({
          id: 'c-1',
          name: 'Child',
          birthyear: 2020,
          availableEvents: null,
        })
      ).toEqual([]);
    });

    it('sorts events by their earliest occurrence time ascending and places occurrence-less events last', () => {
      const eventLater = fakeAvailableEvent({
        id: 'ev-later',
        name: 'Later Event',
        occurrences: {
          edges: [
            {
              node: fakeAvailableOccurrence({
                id: 'occ-later',
                time: '2026-10-20T10:00:00Z',
              }),
            },
          ],
        },
      });

      const eventEarlier = fakeAvailableEvent({
        id: 'ev-earlier',
        name: 'Earlier Event',
        occurrences: {
          edges: [
            {
              node: fakeAvailableOccurrence({
                id: 'occ-earlier',
                time: '2026-10-05T10:00:00Z',
              }),
            },
          ],
        },
      });

      const eventNoOccurrences = fakeAvailableEvent({
        id: 'ev-no-occ',
        name: 'No Occurrences Event',
        occurrences: { edges: [] },
      });

      const child = {
        id: 'c-1',
        name: 'Child',
        birthyear: 2020,
        availableEvents: {
          edges: [
            null,
            { node: eventLater },
            { node: eventNoOccurrences },
            { node: eventEarlier },
          ],
        },
      };

      const sorted = extractAvailableEvents(child);
      expect(sorted).toHaveLength(3);
      expect(sorted[0].id).toBe('ev-earlier');
      expect(sorted[1].id).toBe('ev-later');
      expect(sorted[2].id).toBe('ev-no-occ');

      // Also directly test reusable sortEventsByEarliestOccurrence
      const directlySorted = sortEventsByEarliestOccurrence([
        eventLater,
        eventNoOccurrences,
        eventEarlier,
      ]);
      expect(directlySorted.map((e) => e.id)).toEqual([
        'ev-earlier',
        'ev-later',
        'ev-no-occ',
      ]);
    });

    it('extracts and deduplicates events from upcomingEventsAndEventGroups including event groups', () => {
      const standaloneEvent = fakeAvailableEvent({
        id: 'standalone-1',
        name: 'Standalone Event',
        occurrences: {
          edges: [
            {
              node: fakeAvailableOccurrence({
                id: 'occ-1',
                time: '2026-10-10T10:00:00Z',
              }),
            },
          ],
        },
      });

      const groupEvent1 = fakeAvailableEvent({
        id: 'group-ev-1',
        name: 'Group Event 1',
        occurrences: {
          edges: [
            {
              node: fakeAvailableOccurrence({
                id: 'occ-2',
                time: '2026-10-05T10:00:00Z',
              }),
            },
          ],
        },
      });

      const groupEvent2 = fakeAvailableEvent({
        id: 'group-ev-2',
        name: 'Group Event 2',
        occurrences: {
          edges: [
            {
              node: fakeAvailableOccurrence({
                id: 'occ-3',
                time: '2026-10-15T10:00:00Z',
              }),
            },
          ],
        },
      });

      const child = {
        id: 'c-1',
        name: 'Child',
        birthyear: 2020,
        upcomingEventsAndEventGroups: {
          edges: [
            {
              node: {
                __typename: 'EventNode' as const,
                ...standaloneEvent,
              },
            },
            {
              node: {
                __typename: 'EventGroupNode' as const,
                id: 'eg-1',
                name: 'Event Group 1',
                events: {
                  edges: [
                    { node: groupEvent1 },
                    { node: groupEvent2 },
                    { node: groupEvent1 }, // duplicate test
                  ],
                },
              },
            },
          ],
        },
      };

      const events = extractAvailableEvents(child);
      expect(events).toHaveLength(3);
      // Sorted chronologically: groupEvent1 (Oct 5), standaloneEvent (Oct 10), groupEvent2 (Oct 15)
      expect(events.map((e) => e.id)).toEqual([
        'group-ev-1',
        'standalone-1',
        'group-ev-2',
      ]);
    });
  });

  describe('isEventEligible', () => {
    it('returns true when event has no enrolmentDeniedReason and is not enrolled in', () => {
      const event = fakeAvailableEvent({
        id: 'ev-eligible',
        enrolmentDeniedReason: null,
      });
      expect(isEventEligible(event)).toBe(true);
      expect(isEventEligible(event, new Set(['other-event']))).toBe(true);
    });

    it('returns false when child is enrolled in this event', () => {
      const event = fakeAvailableEvent({
        id: 'ev-enrolled',
        enrolmentDeniedReason: null,
      });
      expect(isEventEligible(event, new Set(['ev-enrolled']))).toBe(false);
    });

    it('returns false when event has any enrolmentDeniedReason', () => {
      const event = fakeAvailableEvent({
        id: 'ev-ineligible',
        enrolmentDeniedReason: 'ALREADY_JOINED_EVENT_GROUP' as any,
      });
      expect(isEventEligible(event)).toBe(false);
    });

    it('returns false when event has childPassword on ticketSystem', () => {
      const event = fakeAvailableEvent({
        id: 'ev-ticket-enrolled',
        ticketSystem: {
          type: 'TICKETMASTER' as any,
          childPassword: 'PASSWORD-123',
        },
        enrolmentDeniedReason: null,
      });
      expect(isEventEligible(event)).toBe(false);
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

  describe('date and URL serialization utilities', () => {
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
      ])(
        'converts between "$iso" and "$finnish"',
        ({ iso, finnish }) => {
          expect(formatIsoDateToFinnish(iso)).toBe(finnish);
          expect(formatFinnishDateToIso(finnish)).toBe(iso);
        }
      );

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

  describe('filterAvailableEvents', () => {
    const baseOcc1 = fakeAvailableOccurrence({
      id: 'occ-1',
      time: '2026-10-15T10:00:00Z',
      remainingCapacity: 4,
      occurrenceLanguage: Language.Fi,
    });

    const baseOcc2 = fakeAvailableOccurrence({
      id: 'occ-2',
      time: '2026-11-20T12:00:00Z',
      remainingCapacity: 1, // Full (less than 2 seats)
      occurrenceLanguage: Language.Sv,
    });

    const testEvent = fakeAvailableEvent({
      id: 'event-test',
      name: 'Testitapahtuma',
      participantsPerInvite: EventParticipantsPerInvite.Family,
      themePaths: [{ id: 'tp-1', slug: 'rytmi', name: 'Rytmi' }],
      accessibility: ['sensory', 'mobility'],
      occurrences: {
        edges: [{ node: baseOcc1 }, { node: baseOcc2 }],
      },
    });

    it('matches event with matching themePath, accessibility, and familyOnly', () => {
      expect(isEventNotFull(testEvent)).toBe(true);
      expect(
        doesOccurrenceMatchFilters(baseOcc1, {
          startDate: new Date('2026-10-01'),
          languages: ['fi'],
          availableOnly: true,
        })
      ).toBe(true);

      const matched = filterAvailableEvents([testEvent], {
        themePaths: ['rytmi'],
        accessibility: ['sensory'],
        familyOnly: true,
      });
      expect(matched).toHaveLength(1);
    });

    it('rejects event when themePaths or accessibility does not match or is missing', () => {
      const noThemeMatch = filterAvailableEvents([testEvent], {
        themePaths: ['tarina'],
      });
      expect(noThemeMatch).toHaveLength(0);

      const eventNoTheme = fakeAvailableEvent({
        id: 'no-theme',
        themePaths: [],
      });
      expect(
        filterAvailableEvents([eventNoTheme], { themePaths: ['rytmi'] })
      ).toHaveLength(0);
    });

    it('evaluates simultaneous occurrence-level criteria on occurrences', () => {
      // Occurrence 1: 15.10.2026, capacity: 4, language: FI
      // Occurrence 2: 20.11.2026, capacity: 1, language: SV

      // Filter: startDate = 20.10.2026, language = SV, availableOnly = false -> matches occ2
      const matchedSv = filterAvailableEvents([testEvent], {
        startDate: '20.10.2026',
        languages: ['sv'],
        availableOnly: false,
      });
      expect(matchedSv).toHaveLength(1);

      // Filter: startDate = 20.10.2026, language = SV, availableOnly = true -> rejected because occ2 has only 1 seat (< 2)
      const rejectedCapacity = filterAvailableEvents([testEvent], {
        startDate: '20.10.2026',
        languages: ['sv'],
        availableOnly: true,
      });
      expect(rejectedCapacity).toHaveLength(0);

      // Filter: startDate = 01.10.2026, language = FI, availableOnly = true -> matches occ1 (capacity 4 >= 2)
      const matchedFi = filterAvailableEvents([testEvent], {
        startDate: '01.10.2026',
        languages: ['fi'],
        availableOnly: true,
      });
      expect(matchedFi).toHaveLength(1);
    });
  });
});
