import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { EVENT_SEARCH_FILTER_KEYS } from '../../types/filterTypes';
import type {
  EventSearchFilters,
  FilterBadgeItem,
} from '../../types/filterTypes';
import {
  BADGE_FILTER_REMOVERS,
  getNextBadgeFocusTarget,
  removeFilterByBadge,
  useFilterBadges,
} from '../useFilterBadges';
import { BADGE_GENERATORS } from '../useActiveBadges';

const INITIAL_FILTERS: EventSearchFilters = {
  themePaths: ['rytmi', 'tarina'],
  startDate: '15.02.2025',
  accessibility: ['mobility', 'hearing'],
  languages: ['fi', 'sv'],
  availableOnly: true,
  familyOnly: true,
};

describe('useFilterBadges and badge remover handlers', () => {
  describe('BADGE_FILTER_REMOVERS and removeFilterByBadge', () => {
    it('defines remover handlers for all filter keys in EVENT_SEARCH_FILTER_KEYS', () => {
      expect(Object.keys(BADGE_FILTER_REMOVERS).sort()).toEqual(
        [...EVENT_SEARCH_FILTER_KEYS].sort()
      );
    });

    it('removes a themePath value from themePaths array', () => {
      const badge: FilterBadgeItem = {
        id: 'themePath-rytmi',
        category: 'themePaths',
        value: 'rytmi',
        label: 'Rytmi',
      };
      const result = removeFilterByBadge(INITIAL_FILTERS, badge);
      expect(result.themePaths).toEqual(['tarina']);
      expect(result.startDate).toBe('15.02.2025');
    });

    it('clears startDate', () => {
      const badge: FilterBadgeItem = {
        id: 'startDate-15.02.2025',
        category: 'startDate',
        value: '15.02.2025',
        label: '15.02.2025 alkaen',
      };
      const result = removeFilterByBadge(INITIAL_FILTERS, badge);
      expect(result.startDate).toBe('');
    });

    it('removes an accessibility option', () => {
      const badge: FilterBadgeItem = {
        id: 'accessibility-mobility',
        category: 'accessibility',
        value: 'mobility',
        label: 'Esteetön pääsy',
      };
      const result = removeFilterByBadge(INITIAL_FILTERS, badge);
      expect(result.accessibility).toEqual(['hearing']);
    });

    it('removes a language option', () => {
      const badge: FilterBadgeItem = {
        id: 'language-fi',
        category: 'languages',
        value: 'fi',
        label: 'Suomi',
      };
      const result = removeFilterByBadge(INITIAL_FILTERS, badge);
      expect(result.languages).toEqual(['sv']);
    });

    it('sets availableOnly to false', () => {
      const badge: FilterBadgeItem = {
        id: 'availableOnly-true',
        category: 'availableOnly',
        value: 'true',
        label: 'Vain vapaat',
      };
      const result = removeFilterByBadge(INITIAL_FILTERS, badge);
      expect(result.availableOnly).toBe(false);
    });

    it('sets familyOnly to false', () => {
      const badge: FilterBadgeItem = {
        id: 'familyOnly-true',
        category: 'familyOnly',
        value: 'true',
        label: 'Koko perheelle',
      };
      const result = removeFilterByBadge(INITIAL_FILTERS, badge);
      expect(result.familyOnly).toBe(false);
    });

    it('returns original filters for unknown category', () => {
      const unknownBadge = {
        id: 'unknown-1',
        category: 'nonExistent' as any,
        value: 'val',
        label: 'Unknown',
      };
      const result = removeFilterByBadge(INITIAL_FILTERS, unknownBadge);
      expect(result).toEqual(INITIAL_FILTERS);
    });
  });

  describe('BADGE_GENERATORS in useActiveBadges', () => {
    it('defines badge generators for all filter keys in EVENT_SEARCH_FILTER_KEYS', () => {
      expect(Object.keys(BADGE_GENERATORS).sort()).toEqual(
        [...EVENT_SEARCH_FILTER_KEYS].sort()
      );
    });
  });

  describe('getNextBadgeFocusTarget', () => {
    const badges: FilterBadgeItem[] = [
      { id: 'badge-1', category: 'themePaths', value: '1', label: '1' },
      { id: 'badge-2', category: 'themePaths', value: '2', label: '2' },
      { id: 'badge-3', category: 'themePaths', value: '3', label: '3' },
    ];

    it('focuses the next sibling badge when removing an element before the end', () => {
      const el1 = document.createElement('button');
      const el2 = document.createElement('button');
      const el3 = document.createElement('button');
      const badgeRefs = new Map<string, HTMLElement>([
        ['badge-1', el1],
        ['badge-2', el2],
        ['badge-3', el3],
      ]);

      const target = getNextBadgeFocusTarget({
        activeBadges: badges,
        removedBadgeId: 'badge-1',
        badgeRefs,
      });

      expect(target).toBe(el2);
    });

    it('focuses the previous sibling badge when removing the last element', () => {
      const el1 = document.createElement('button');
      const el2 = document.createElement('button');
      const el3 = document.createElement('button');
      const badgeRefs = new Map<string, HTMLElement>([
        ['badge-1', el1],
        ['badge-2', el2],
        ['badge-3', el3],
      ]);

      const target = getNextBadgeFocusTarget({
        activeBadges: badges,
        removedBadgeId: 'badge-3',
        badgeRefs,
      });

      expect(target).toBe(el2);
    });

    it('falls back to fallbackElement when only one badge exists', () => {
      const fallback = document.createElement('button');
      const singleBadge: FilterBadgeItem[] = [
        { id: 'badge-1', category: 'themePaths', value: '1', label: '1' },
      ];
      const target = getNextBadgeFocusTarget({
        activeBadges: singleBadge,
        removedBadgeId: 'badge-1',
        badgeRefs: new Map(),
        fallbackElement: fallback,
      });

      expect(target).toBe(fallback);
    });
  });

  describe('useFilterBadges hook', () => {
    const themePathOptions = [
      { label: 'Rytmi', value: 'rytmi' },
      { label: 'Tarina', value: 'tarina' },
    ];
    const accessibilityOptions = [{ label: 'Esteetön', value: 'mobility' }];
    const languageOptions = [{ label: 'Suomi', value: 'fi' }];

    it('computes activeBadges, supports ref registration, and removes badge with focus continuity', async () => {
      vi.useFakeTimers();
      const onFilterChange = vi.fn();
      const fallbackButton = document.createElement('button');
      const fallbackFocusRef = { current: fallbackButton };

      const { result } = renderHook(
        (props) =>
          useFilterBadges({
            draftFilters: props.filters,
            themePathOptions,
            accessibilityOptions,
            languageOptions,
            onFilterChange,
            fallbackFocusRef,
          }),
        {
          initialProps: {
            filters: {
              ...INITIAL_FILTERS,
              themePaths: ['rytmi', 'tarina'],
              startDate: '',
              accessibility: [],
              languages: [],
              availableOnly: false,
              familyOnly: false,
            },
          },
        }
      );

      expect(result.current.activeBadges).toHaveLength(2);
      expect(result.current.activeBadges[0].id).toBe('themePath-rytmi');
      expect(result.current.activeBadges[1].id).toBe('themePath-tarina');

      // Register DOM refs
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      const focusSpy2 = vi.spyOn(button2, 'focus');

      act(() => {
        result.current.registerBadgeRef('themePath-rytmi', button1);
        result.current.registerBadgeRef('themePath-tarina', button2);
      });

      expect(result.current.badgeRefs.current.get('themePath-rytmi')).toBe(
        button1
      );

      // Unregister ref when element is null
      act(() => {
        result.current.registerBadgeRef(
          'temp',
          document.createElement('button')
        );
        result.current.registerBadgeRef('temp', null);
      });
      expect(result.current.badgeRefs.current.has('temp')).toBe(false);

      // Remove the first badge
      act(() => {
        result.current.removeBadge(result.current.activeBadges[0]);
      });

      expect(onFilterChange).toHaveBeenCalledTimes(1);
      expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          themePaths: ['tarina'],
        })
      );

      // Verify next element gets focused after setTimeout
      act(() => {
        vi.runAllTimers();
      });
      expect(focusSpy2).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });
});
