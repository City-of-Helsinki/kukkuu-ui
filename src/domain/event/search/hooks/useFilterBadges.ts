import { useCallback, useRef } from 'react';
import type { TFunction } from 'i18next';

import { DEFAULT_SEARCH_FILTERS } from '../eventSearchUtils';
import type {
  EventSearchFilters,
  FilterBadgeItem,
  FilterOption,
} from '../types/filterTypes';
import { useActiveBadges } from './useActiveBadges';

/** Handler type for removing a filter value from an EventSearchFilters state object. */
export type FilterRemover = (
  filters: EventSearchFilters,
  value: string
) => EventSearchFilters;

/**
 * Strategy/remover object map for each search filter category.
 * Enforces completeness over `keyof EventSearchFilters` at compile time.
 */
export const BADGE_FILTER_REMOVERS: Record<
  keyof EventSearchFilters,
  FilterRemover
> = {
  themePaths: (filters, value) => ({
    ...filters,
    themePaths: filters.themePaths.filter((s) => s !== value),
  }),
  startDate: (filters) => ({
    ...filters,
    startDate: '',
  }),
  accessibility: (filters, value) => ({
    ...filters,
    accessibility: filters.accessibility.filter((a) => a !== value),
  }),
  languages: (filters, value) => ({
    ...filters,
    languages: filters.languages.filter((l) => l !== value),
  }),
  availableOnly: (filters) => ({
    ...filters,
    availableOnly: false,
  }),
  familyOnly: (filters) => ({
    ...filters,
    familyOnly: false,
  }),
};

/**
 * Pure function that returns a new `EventSearchFilters` with the specified badge removed.
 */
export function removeFilterByBadge(
  filters: EventSearchFilters,
  badge: FilterBadgeItem
): EventSearchFilters {
  const remover = BADGE_FILTER_REMOVERS[badge.category];
  return remover ? remover(filters, badge.value) : filters;
}

/**
 * Determines the next element to receive focus when a badge is deleted,
 * prioritizing the next sibling badge, then previous sibling badge, then fallback element.
 */
export function getNextBadgeFocusTarget({
  activeBadges,
  removedBadgeId,
  badgeRefs,
  fallbackElement,
}: {
  activeBadges: FilterBadgeItem[];
  removedBadgeId: string;
  badgeRefs: Map<string, HTMLElement>;
  fallbackElement?: HTMLElement | null;
}): HTMLElement | null {
  const currentIndex = activeBadges.findIndex((b) => b.id === removedBadgeId);
  let nextFocusTarget: HTMLElement | null = null;

  if (activeBadges.length > 1 && currentIndex !== -1) {
    if (currentIndex < activeBadges.length - 1) {
      const nextBadge = activeBadges[currentIndex + 1];
      nextFocusTarget = badgeRefs.get(nextBadge.id) ?? null;
    } else if (currentIndex > 0) {
      const prevBadge = activeBadges[currentIndex - 1];
      nextFocusTarget = badgeRefs.get(prevBadge.id) ?? null;
    }
  }

  return nextFocusTarget ?? fallbackElement ?? null;
}

/** Parameters for `useFilterBadges`. */
export type UseFilterBadgesParams = {
  /** Active search filters currently affecting results (typically from URL). */
  filters?: EventSearchFilters;
  /** Draft search filters (deprecated alias for `filters`). */
  draftFilters?: EventSearchFilters;
  themePathOptions: FilterOption[];
  accessibilityOptions: FilterOption[];
  languageOptions: FilterOption[];
  onFilterChange: (nextFilters: EventSearchFilters) => void;
  fallbackFocusRef?: React.RefObject<HTMLElement | null>;
  t?: TFunction;
};

/** Return value of `useFilterBadges`. */
export type UseFilterBadgesResult = {
  activeBadges: FilterBadgeItem[];
  registerBadgeRef: (id: string, el: HTMLElement | null) => void;
  removeBadge: (badge: FilterBadgeItem) => void;
  badgeRefs: React.MutableRefObject<Map<string, HTMLElement>>;
};

/**
 * Custom hook that collects all filter badge features:
 * - Active badge computation via `useActiveBadges`
 * - Badge DOM element reference registration for accessibility
 * - Focus continuity management on removal
 * - Pure object-driven filter removal via `BADGE_FILTER_REMOVERS`
 */
export function useFilterBadges({
  filters,
  draftFilters,
  themePathOptions,
  accessibilityOptions,
  languageOptions,
  onFilterChange,
  fallbackFocusRef,
  t,
}: UseFilterBadgesParams): UseFilterBadgesResult {
  const badgeRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerBadgeRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      badgeRefs.current.set(id, el);
    } else {
      badgeRefs.current.delete(id);
    }
  }, []);

  const activeFilters = filters ?? draftFilters ?? DEFAULT_SEARCH_FILTERS;

  const { badges: activeBadges } = useActiveBadges({
    filter: activeFilters,
    themePathOptions,
    accessibilityOptions,
    languageOptions,
    t,
  });

  const removeBadge = useCallback(
    (badge: FilterBadgeItem) => {
      const nextFocusTarget = getNextBadgeFocusTarget({
        activeBadges,
        removedBadgeId: badge.id,
        badgeRefs: badgeRefs.current,
        fallbackElement: fallbackFocusRef?.current,
      });

      const nextFilters = removeFilterByBadge(activeFilters, badge);
      onFilterChange(nextFilters);

      setTimeout(() => {
        nextFocusTarget?.focus();
      }, 0);
    },
    [activeBadges, activeFilters, fallbackFocusRef, onFilterChange]
  );

  return {
    activeBadges,
    registerBadgeRef,
    removeBadge,
    badgeRefs,
  };
}

export default useFilterBadges;
