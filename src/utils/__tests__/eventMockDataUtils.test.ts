import { describe, expect, it } from 'vitest';

import {
  fakeAccessibilityNode,
  fakeAvailableEvent,
  fakeAvailableVenue,
  fakeEventNode,
  fakeOccurrenceAccessibility,
  fakeOccurrenceLanguage,
  fakeVenueNode,
} from '../eventMockDataUtils';

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

      expect(eventNode.occurrences?.edges).toEqual([]);
      expect(eventNode.allOccurrences?.edges).toEqual([]);
    });

    it('merges non-array overrides properly', () => {
      const eventNode = fakeEventNode({
        capacityPerOccurrence: 50,
      });

      expect(eventNode.capacityPerOccurrence).toBe(50);
      expect(eventNode.duration).toBe(60);
      expect(eventNode.occurrences?.edges.length).toBe(1);
    });
  });

  describe('fakeOccurrenceLanguage', () => {
    it('returns a real 3-letter ISO 639-3 alpha3Code and language name', () => {
      const language = fakeOccurrenceLanguage();

      expect(language.alpha3Code).toMatch(/^[a-z]{3}$/);
      expect(language.name).toBeTruthy();
    });

    it('supports overrides', () => {
      const language = fakeOccurrenceLanguage({
        alpha3Code: 'fin',
        name: 'suomi',
      });

      expect(language).toEqual({
        alpha3Code: 'fin',
        name: 'suomi',
      });
    });
  });

  describe('fakeOccurrenceAccessibility', () => {
    it('returns one of the database accessibilities', () => {
      const accessibility = fakeOccurrenceAccessibility();

      expect(accessibility.id).toBeTruthy();
      expect([
        'sensory_sensitivity',
        'executive_function',
        'vision',
        'hearing',
        'mobility',
      ]).toContain(accessibility.slug);
      expect(accessibility.name).toBeTruthy();
      expect(accessibility.sortOrder).toBeGreaterThanOrEqual(1);
    });

    it('matches database defaults when slug override is provided', () => {
      const accessibility = fakeOccurrenceAccessibility({ slug: 'hearing' });

      expect(accessibility.slug).toBe('hearing');
      expect(accessibility.name).toBe('Kuulemisen tuki');
      expect(accessibility.sortOrder).toBe(4);
    });
  });

  describe('fakeAccessibilityNode', () => {
    it('returns an AccessibilityNode with description and __typename', () => {
      const accessibility = fakeAccessibilityNode({
        slug: 'sensory_sensitivity',
      });

      expect(accessibility.__typename).toBe('AccessibilityNode');
      expect(accessibility.slug).toBe('sensory_sensitivity');
      expect(accessibility.name).toBe('Aistiherkkyys');
      expect(accessibility.description).toBe('Aistiherkkyys huomioitu');
      expect(accessibility.sortOrder).toBe(1);
    });
  });

  describe('fakeAvailableVenue', () => {
    it('returns a venue with id, name, and address', () => {
      const venue = fakeAvailableVenue();

      expect(venue.id).toBeTruthy();
      expect(venue.name).toBeTruthy();
      expect(venue.address).toBeTruthy();
    });
  });

  describe('fakeVenueNode', () => {
    it('returns a VenueNode with __typename and supports overrides', () => {
      const venue = fakeVenueNode({ name: 'Annantalo' });

      expect(venue.__typename).toBe('VenueNode');
      expect(venue.name).toBe('Annantalo');
      expect(venue.address).toBeTruthy();
    });
  });
});
