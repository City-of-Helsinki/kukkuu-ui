import { describe, expect, it } from 'vitest';

import {
  extractAvailableEvents,
  getEventLanguageText,
  getEventOccurrencesSummary,
  getEventTimeText,
  getEventVenueText,
  isEventEligible,
  paginateSearchItems,
  sortEventsByEarliestOccurrence,
} from '../eventSearchUtils';
import type { AvailableEvent } from '../../types/ChildAvailableOccurrencesTypes';
import {
  fakeAvailableEvent,
  fakeAvailableOccurrence,
} from '../../../../utils/eventMockDataUtils';

describe('eventSearchUtils', () => {
  describe('paginateSearchItems', () => {
    const items = Array.from({ length: 35 }, (_, i) => `item-${i + 1}`);

    it('slices items for the first page with default pageSize 15', () => {
      const result = paginateSearchItems(items, 1, 15);
      expect(result.items).toHaveLength(15);
      expect(result.items[0]).toBe('item-1');
      expect(result.items[14]).toBe('item-15');
      expect(result.totalCount).toBe(35);
      expect(result.remainingCount).toBe(20);
      expect(result.hasMore).toBe(true);
      expect(result.pageCount).toBe(3);
      expect(result.currentPage).toBe(1);
    });

    it('slices items cumulatively for page 2', () => {
      const result = paginateSearchItems(items, 2, 15);
      expect(result.items).toHaveLength(30);
      expect(result.remainingCount).toBe(5);
      expect(result.hasMore).toBe(true);
      expect(result.currentPage).toBe(2);
    });

    it('slices all items on the last page and sets hasMore to false', () => {
      const result = paginateSearchItems(items, 3, 15);
      expect(result.items).toHaveLength(35);
      expect(result.remainingCount).toBe(0);
      expect(result.hasMore).toBe(false);
      expect(result.currentPage).toBe(3);
    });

    it('clamps page index to pageCount when page exceeds total pages', () => {
      const result = paginateSearchItems(items, 99, 15);
      expect(result.items).toHaveLength(35);
      expect(result.currentPage).toBe(3);
      expect(result.hasMore).toBe(false);
    });

    it('handles empty items array gracefully', () => {
      const result = paginateSearchItems([], 1, 15);
      expect(result.items).toHaveLength(0);
      expect(result.totalCount).toBe(0);
      expect(result.remainingCount).toBe(0);
      expect(result.hasMore).toBe(false);
      expect(result.pageCount).toBe(1);
      expect(result.currentPage).toBe(1);
    });
  });

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
      expect(timeText).toContain('5.10.2026');
      expect(timeText).toContain('13:00–14:00'); // Europe/Helsinki UTC+3
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
});
