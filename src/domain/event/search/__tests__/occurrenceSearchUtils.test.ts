import { describe, expect, it } from 'vitest';

import {
  flattenAvailableOccurrences,
  isOccurrenceEnrollable,
} from '../occurrenceSearchUtils';
import type {
  AvailableEvent,
  AvailableOccurrence,
  ChildAvailableOccurrencesQuery,
} from '../../types/ChildAvailableOccurrencesTypes';

describe('occurrenceSearchUtils', () => {
  describe('flattenAvailableOccurrences', () => {
    it('returns empty array when child or availableEvents is null/undefined', () => {
      expect(flattenAvailableOccurrences(null)).toEqual([]);
      expect(flattenAvailableOccurrences(undefined)).toEqual([]);
      expect(
        flattenAvailableOccurrences({
          id: 'child-1',
          name: 'Child',
          birthyear: 2020,
          availableEvents: null,
        })
      ).toEqual([]);
    });

    it('flattens and sorts occurrences ascending by time, skipping null edges', () => {
      const mockChild: ChildAvailableOccurrencesQuery['child'] = {
        id: 'child-1',
        name: 'Child',
        birthyear: 2020,
        availableEvents: {
          edges: [
            null,
            {
              node: {
                id: 'event-1',
                name: 'Event 1',
                shortDescription: 'Desc 1',
                image: 'img1.png',
                imageAltText: 'Alt 1',
                duration: 60,
                canChildEnroll: true,
                occurrences: {
                  edges: [
                    null,
                    {
                      node: {
                        id: 'occ-2',
                        time: '2026-10-10T12:00:00Z',
                        remainingCapacity: 5,
                        occurrenceLanguage: 'FI' as any,
                        venue: { id: 'v1', name: 'Venue 1', address: 'Street 1' },
                      },
                    },
                    {
                      node: {
                        id: 'occ-1',
                        time: '2026-10-05T10:00:00Z',
                        remainingCapacity: 2,
                        occurrenceLanguage: 'FI' as any,
                        venue: { id: 'v1', name: 'Venue 1', address: 'Street 1' },
                      },
                    },
                  ],
                },
              },
            },
            {
              node: {
                id: 'event-2',
                name: 'Event 2',
                shortDescription: 'Desc 2',
                image: null,
                imageAltText: null,
                duration: 45,
                canChildEnroll: false,
                occurrences: {
                  edges: [
                    {
                      node: {
                        id: 'occ-3',
                        time: '2026-10-07T14:00:00Z',
                        remainingCapacity: 0,
                        occurrenceLanguage: 'SV' as any,
                        venue: { id: 'v2', name: 'Venue 2', address: 'Street 2' },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      };

      const result = flattenAvailableOccurrences(mockChild);
      expect(result).toHaveLength(3);
      expect(result[0].occurrence.id).toBe('occ-1');
      expect(result[1].occurrence.id).toBe('occ-3');
      expect(result[2].occurrence.id).toBe('occ-2');
    });
  });

  describe('isOccurrenceEnrollable', () => {
    const baseEvent: AvailableEvent = {
      id: 'event-1',
      name: 'Event',
      shortDescription: 'Short',
      image: null,
      imageAltText: null,
      duration: 30,
      canChildEnroll: true,
      occurrences: { edges: [] },
    };

    const baseOccurrence: AvailableOccurrence = {
      id: 'occ-1',
      time: '2026-10-10T10:00:00Z',
      remainingCapacity: 5,
      occurrenceLanguage: 'FI' as any,
      venue: { id: 'v1', name: 'Venue', address: 'Address' },
    };

    it('returns true when child can enroll and remaining capacity > 0', () => {
      expect(
        isOccurrenceEnrollable({
          event: baseEvent,
          occurrence: baseOccurrence,
        })
      ).toBe(true);
    });

    it('returns true when child can enroll and remaining capacity is null (unlimited)', () => {
      expect(
        isOccurrenceEnrollable({
          event: baseEvent,
          occurrence: { ...baseOccurrence, remainingCapacity: null },
        })
      ).toBe(true);
    });

    it('returns false when child cannot enroll to event', () => {
      expect(
        isOccurrenceEnrollable({
          event: { ...baseEvent, canChildEnroll: false },
          occurrence: baseOccurrence,
        })
      ).toBe(false);
    });

    it('returns false when remaining capacity is 0', () => {
      expect(
        isOccurrenceEnrollable({
          event: baseEvent,
          occurrence: { ...baseOccurrence, remainingCapacity: 0 },
        })
      ).toBe(false);
    });
  });
});
