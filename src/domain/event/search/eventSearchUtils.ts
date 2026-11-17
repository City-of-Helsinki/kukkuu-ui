import type { TFunction } from 'i18next';

import {
  extractUniqueLanguages,
  extractUniqueVenues,
  formatEventLanguagesText,
  formatEventSummaryDateTime,
  formatEventVenueText,
} from '../EventUtils';
import type {
  AvailableEvent,
  AvailableOccurrence,
  AvailableVenue,
  EventsSearchQuery,
} from '../types/EventsSearchTypes';
import type { EventSearchFilters } from './types/filterTypes';
import {
  FILTER_URL_CONFIG,
  type FilterOptionsContext,
} from './searchFilterUrlConfig';

export {
  EVENT_SEARCH_FILTER_KEYS,
  type EventSearchFilterKey,
} from './types/filterTypes';
export {
  FILTER_URL_CONFIG,
  type FilterUrlConfig,
  type FilterOptionsContext,
  SEARCH_URL_PARAMS,
} from './searchFilterUrlConfig';
export {
  BADGE_FILTER_REMOVERS,
  removeFilterByBadge,
} from './hooks/useFilterBadges';
export {
  createValidDate,
  formatFinnishDateToIso,
  formatIsoDateToFinnish,
  parseFilterStartDate,
  parseFinnishDate,
  parseIsoDate,
} from './searchDateUtils';

export const DEFAULT_SEARCH_PAGE_SIZE = 15;

export const DEFAULT_SEARCH_FILTERS: EventSearchFilters = Object.fromEntries(
  (Object.keys(FILTER_URL_CONFIG) as (keyof EventSearchFilters)[]).map((key) => [
    key,
    FILTER_URL_CONFIG[key].defaultValue,
  ])
) as EventSearchFilters;

/**
 * Checks whether a specific search filter category has an active (non-default) value.
 *
 * @param filters - Current filter state.
 * @param key - The filter category to inspect.
 * @returns True if the filter has an active value, false if empty or default.
 */
export const isFilterActive = (
  filters: EventSearchFilters,
  key: keyof EventSearchFilters
): boolean => {
  const config = FILTER_URL_CONFIG[key];
  return config ? config.isActive(filters[key] as never) : false;
};

/**
 * Checks whether any search filter category is currently active in the given filter state.
 *
 * @param filters - Current filter state.
 * @returns True if at least one filter category is active.
 */
export const hasActiveFilters = (filters: EventSearchFilters): boolean => {
  return (Object.keys(DEFAULT_SEARCH_FILTERS) as (keyof EventSearchFilters)[]).some(
    (key) => isFilterActive(filters, key)
  );
};

/**
 * Parses and sanitizes search filter values from URLSearchParams.
 * Accepts both repeated parameters and comma-separated values, and both ISO and Finnish date strings.
 */
export const parseSearchFiltersFromUrl = (
  searchParams: URLSearchParams,
  validOptions?: FilterOptionsContext
): EventSearchFilters => {
  const entries = (
    Object.keys(FILTER_URL_CONFIG) as (keyof EventSearchFilters)[]
  ).map((key) => [
    key,
    FILTER_URL_CONFIG[key].parseFromUrl(searchParams, validOptions),
  ]);
  return Object.fromEntries(entries) as EventSearchFilters;
};

/**
 * Serializes search filter values into URLSearchParams using canonical repeated parameters
 * and ISO date format (YYYY-MM-DD).
 */
export const writeSearchFiltersToUrlParams = (
  params: URLSearchParams,
  childId: string | null | undefined,
  filters: EventSearchFilters
): void => {
  if (childId) {
    params.set('child', childId);
  } else {
    params.delete('child');
  }
  params.delete('childId');

  (Object.keys(FILTER_URL_CONFIG) as (keyof EventSearchFilters)[]).forEach(
    (key) => {
      FILTER_URL_CONFIG[key].writeToUrl(params, filters[key] as never);
    }
  );
};

/**
 * Extracts non-null event nodes in server-returned order from the `Query.events` connection.
 */
export const extractSearchEvents = (
  eventsConnection?: EventsSearchQuery['events'] | null
): AvailableEvent[] => {
  if (!eventsConnection?.edges) {
    return [];
  }
  return eventsConnection.edges
    .map((edge) => edge?.node)
    .filter((event): event is AvailableEvent => Boolean(event));
};

/**
 * Returns non-null event occurrences sorted chronologically by start time ascending.
 */
export const getSortedEventOccurrences = (
  event: AvailableEvent
): AvailableOccurrence[] => {
  return (event.occurrences?.edges || [])
    .map((edge) => edge?.node)
    .filter((occ): occ is AvailableOccurrence => Boolean(occ))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
};

export type EventOccurrencesSummary = {
  count: number;
  firstOccurrence: AvailableOccurrence | null;
  lastOccurrence: AvailableOccurrence | null;
  uniqueVenues: AvailableVenue[];
  uniqueLanguages: string[];
};

/**
 * Aggregates an event's occurrences into a summary with total count, first/last occurrence,
 * deduplicated venues, and deduplicated lowercase language codes.
 */
export const getEventOccurrencesSummary = (
  event: AvailableEvent
): EventOccurrencesSummary => {
  const sorted = getSortedEventOccurrences(event);
  return {
    count: sorted.length,
    firstOccurrence: sorted[0] ?? null,
    lastOccurrence: sorted.at(-1) ?? null,
    uniqueVenues: extractUniqueVenues(null, sorted),
    uniqueLanguages: extractUniqueLanguages(null, sorted),
  };
};

/**
 * Formats a user-friendly date and time string for an event card.
 * For single-occurrence events, returns date and time range (e.g. "Ma 5.10.2026 klo 10:00–11:00").
 * For multi-occurrence events, returns a date range and total occurrence count.
 *
 * @param event - The event to format time for.
 * @param t - i18next translation function.
 * @param locale - Locale code for date formatting (default: 'fi').
 * @returns Formatted time string, or null if the event has no occurrences.
 */
export const getEventTimeText = (
  event: AvailableEvent,
  t: TFunction,
  locale = 'fi'
): string | null => {
  const sorted = getSortedEventOccurrences(event);
  return formatEventSummaryDateTime({
    allOccurrences: sorted,
    duration: event.duration,
    locale,
    t,
  });
};

/**
 * Formats venue information for an event card.
 * For a single unique venue, combines name and address.
 * For multiple venues, returns localized "Useita tapahtumapaikkoja"
 * (or falls back to comma-separated names if `t` is omitted).
 *
 * @param event - The event to format venue information for.
 * @param t - Optional i18next translation function.
 * @returns Formatted venue string, or null if no venues are associated with the event.
 */
export const getEventVenueText = (
  event: AvailableEvent,
  t?: TFunction
): string | null => {
  const sorted = getSortedEventOccurrences(event);
  if (t) {
    return formatEventVenueText(sorted, t);
  }
  const uniqueVenues = extractUniqueVenues(null, sorted);
  if (uniqueVenues.length === 0) return null;
  if (uniqueVenues.length === 1) {
    const v = uniqueVenues[0];
    return [v.name, v.address].filter(Boolean).join(', ') || null;
  }
  return uniqueVenues
    .map((v) => v.name || v.address)
    .filter(Boolean)
    .join(', ');
};

/**
 * Formats the unique spoken/performed languages for an event into a localized string.
 *
 * @param event - The event to format language information for.
 * @param t - i18next translation function.
 * @returns Localized languages string (e.g. "Kieli: Suomi" or "Kielet: Suomi, Ruotsi"), or null if no languages found.
 */
export const getEventLanguageText = (
  event: AvailableEvent,
  t: TFunction
): string | null => {
  const sorted = getSortedEventOccurrences(event);
  return formatEventLanguagesText(sorted, t);
};
