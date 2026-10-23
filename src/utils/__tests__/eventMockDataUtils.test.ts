import { describe, expect, it } from 'vitest';

import { fakeAvailableEvent, fakeEventNode } from '../eventMockDataUtils';

describe('eventMockDataUtils', () => {
  describe('fakeAvailableEvent', () => {
    it('replaces occurrences.edges array when empty array is supplied in overrides', () => {
      const event = fakeAvailableEvent({
        occurrences: {
          edges: [],
        },
      });

      expect(event.occurrences.edges).toEqual([]);
    });

    it('preserves non-array merge behavior for other properties', () => {
      const event = fakeAvailableEvent({
        name: 'Custom Event Name',
      });

      expect(event.name).toBe('Custom Event Name');
      expect(event.duration).toBe(60);
      expect(event.occurrences.edges.length).toBe(1);
    });
  });

  describe('fakeEventNode', () => {
    it('replaces occurrences.edges and allOccurrences.edges when empty arrays are supplied', () => {
      const eventNode = fakeEventNode({
        occurrences: {
          __typename: 'OccurrenceNodeConnection',
          edges: [],
        },
        allOccurrences: {
          __typename: 'OccurrenceNodeConnection',
          edges: [],
        },
      });

      expect(eventNode.occurrences.edges).toEqual([]);
      expect(eventNode.allOccurrences?.edges).toEqual([]);
    });

    it('merges non-array overrides properly', () => {
      const eventNode = fakeEventNode({
        capacityPerOccurrence: 50,
      });

      expect(eventNode.capacityPerOccurrence).toBe(50);
      expect(eventNode.duration).toBe(60);
      expect(eventNode.occurrences.edges.length).toBe(1);
    });
  });
});
