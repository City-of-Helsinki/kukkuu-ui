import type { TFunction } from 'i18next';

import {
  formatOccurrenceDateLong,
  formatOccurrenceDateRange,
  formatOccurrenceTimeRange,
} from '../../../common/time/occurrenceTime';
import { EventParticipantsPerInvite } from '../../api/generatedTypes/graphql';
import type {
  AvailableEvent,
  AvailableOccurrence,
  AvailableVenue,
  ChildAvailableOccurrencesQuery,
} from '../types/ChildAvailableOccurrencesTypes';
import type { EventSearchFilters } from './types/filterTypes';
import {
  FILTER_URL_CONFIG,
  type FilterOptionsContext,
} from './searchFilterUrlConfig';
import { parseFilterStartDate } from './searchDateUtils';

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

export type PaginatedSearchResult<T> = {
  items: T[];
  allItems: T[];
  totalCount: number;
  remainingCount: number;
  hasMore: boolean;
  pageCount: number;
  currentPage: number;
};

/**
 * Splits an in-memory array into paginated slices for search results.
 *
 * @deprecated TODO: Deprecate client-side in-memory pagination.
 * Pagination should be handled by the backend API via GraphQL connections / cursor-based pagination
 * (e.g., `first`, `after`) or offset pagination rather than slicing in-memory arrays on the client.
 * Remove this function once backend-driven pagination is integrated into the search queries.
 */
export const paginateSearchItems = <T>(
  allItems: T[],
  page = 1,
  pageSize = DEFAULT_SEARCH_PAGE_SIZE
): PaginatedSearchResult<T> => {
  const safePageSize = Math.max(1, pageSize);
  const totalCount = allItems.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / safePageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const items = allItems.slice(0, currentPage * safePageSize);
  const remainingCount = Math.max(0, totalCount - items.length);

  return {
    items,
    allItems,
    totalCount,
    remainingCount,
    hasMore: remainingCount > 0,
    pageCount,
    currentPage,
  };
};

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
 * Checks whether an event is considered to have available capacity.
 * For external ticket events with hasAnyFreePasswords, checks that flag.
 * For events with occurrences, checks if at least one occurrence has remainingCapacity >= 2.
 */
export const isEventNotFull = (event: AvailableEvent): boolean => {
  if (event.ticketSystem?.hasAnyFreePasswords !== undefined) {
    return Boolean(event.ticketSystem.hasAnyFreePasswords);
  }

  const occurrences = (event.occurrences?.edges || [])
    .map((e) => e?.node)
    .filter((occ): occ is AvailableOccurrence => Boolean(occ));

  if (occurrences.length === 0) {
    return true;
  }

  return occurrences.some(
    (occ) => occ.remainingCapacity == null || occ.remainingCapacity >= 2
  );
};

/**
 * Checks whether a single occurrence matches simultaneous occurrence-level filter criteria.
 */
export const doesOccurrenceMatchFilters = (
  occurrence: AvailableOccurrence,
  filters: {
    startDate?: Date | null;
    languages?: string[];
    availableOnly?: boolean;
  }
): boolean => {
  if (filters.startDate) {
    const occTime = new Date(occurrence.time);
    if (occTime < filters.startDate) {
      return false;
    }
  }

  if (filters.languages && filters.languages.length > 0) {
    const occLang = occurrence.occurrenceLanguage?.toLowerCase();
    if (!occLang || !filters.languages.includes(occLang)) {
      return false;
    }
  }

  if (filters.availableOnly) {
    if (
      occurrence.remainingCapacity != null &&
      occurrence.remainingCapacity < 2
    ) {
      return false;
    }
  }

  return true;
};

const matchesAvailableFilter = (
  event: AvailableEvent,
  enrolledEventIds?: Set<string>
): boolean => isEventEligible(event, enrolledEventIds) && isEventNotFull(event);

const matchesFamilyFilter = (event: AvailableEvent): boolean =>
  event.participantsPerInvite === EventParticipantsPerInvite.Family;

const matchesThemePathsFilter = (
  event: AvailableEvent,
  filterThemePaths: string[]
): boolean => {
  const eventSlugs = (event.themePaths || [])
    .map((tp) => tp?.slug)
    .filter((s): s is string => Boolean(s));
  return (
    eventSlugs.length > 0 &&
    filterThemePaths.some((slug) => eventSlugs.includes(slug))
  );
};

const matchesAccessibilityFilter = (
  event: AvailableEvent,
  filterAccessibility: string[]
): boolean => {
  const eventAcc = (event.accessibility || []).filter(Boolean);
  return (
    eventAcc.length > 0 &&
    filterAccessibility.some((acc) => eventAcc.includes(acc))
  );
};

const matchesOccurrenceFilters = (
  event: AvailableEvent,
  options: {
    parsedStartDate: Date | null;
    filterLanguages: string[];
    availableOnly?: boolean;
  }
): boolean => {
  const occurrences = (event.occurrences?.edges || [])
    .map((e) => e?.node)
    .filter((occ): occ is AvailableOccurrence => Boolean(occ));

  if (occurrences.length === 0) {
    return !options.parsedStartDate && options.filterLanguages.length === 0;
  }

  return occurrences.some((occ) =>
    doesOccurrenceMatchFilters(occ, {
      startDate: options.parsedStartDate,
      languages: options.filterLanguages,
      availableOnly: options.availableOnly,
    })
  );
};

/**
 * Filters available events by combining event-level and occurrence-level criteria.
 *
 * @deprecated TODO: Deprecate client-side in-memory event filtering.
 * This function performs filtering over an in-memory array of events on the client side.
 * Filtering should be handled on the backend/API level via GraphQL query arguments
 * (e.g. date range, language, theme paths, accessibility, availability).
 * Once the backend API supports querying filtered events directly, remove this in-memory filter logic
 * and pass the search filter parameters directly to the GraphQL query.
 *
 * @param events - Raw array of available events to filter.
 * @param filters - Active search filters to apply.
 * @param enrolledEventIds - Optional set of event IDs the child has already enrolled in.
 * @returns Filtered array of available events.
 */
export const filterAvailableEvents = (
  events: AvailableEvent[],
  filters: Partial<EventSearchFilters>,
  enrolledEventIds?: Set<string>
): AvailableEvent[] => {
  const parsedStartDate = filters.startDate
    ? parseFilterStartDate(filters.startDate)
    : null;
  const filterLanguages = (filters.languages || []).map((l) => l.toLowerCase());
  const hasOccurrenceFilters = Boolean(
    parsedStartDate || filterLanguages.length > 0 || filters.availableOnly
  );

  return events.filter((event) => {
    if (
      filters.availableOnly &&
      !matchesAvailableFilter(event, enrolledEventIds)
    ) {
      return false;
    }

    if (filters.familyOnly && !matchesFamilyFilter(event)) {
      return false;
    }

    if (
      filters.themePaths &&
      filters.themePaths.length > 0 &&
      !matchesThemePathsFilter(event, filters.themePaths)
    ) {
      return false;
    }

    if (
      filters.accessibility &&
      filters.accessibility.length > 0 &&
      !matchesAccessibilityFilter(event, filters.accessibility)
    ) {
      return false;
    }

    if (
      hasOccurrenceFilters &&
      !matchesOccurrenceFilters(event, {
        parsedStartDate,
        filterLanguages,
        availableOnly: filters.availableOnly,
      })
    ) {
      return false;
    }

    return true;
  });
};

export const getSortedEventOccurrences = (
  event: AvailableEvent
): AvailableOccurrence[] => {
  return (event.occurrences?.edges || [])
    .map((edge) => edge?.node)
    .filter((occ): occ is AvailableOccurrence => Boolean(occ))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
};

/**
 * Sorts available events in ascending order based on the start time of their earliest occurrence.
 * Events with occurrences are ordered before events without any occurrences.
 *
 * @param events - List of events to sort.
 * @returns A sorted copy of the events array.
 */
export const sortEventsByEarliestOccurrence = (
  events: AvailableEvent[]
): AvailableEvent[] => {
  return [...events].sort((a, b) => {
    const occsA = getSortedEventOccurrences(a);
    const occsB = getSortedEventOccurrences(b);
    const earliestA =
      occsA.length > 0 ? new Date(occsA[0].time).getTime() : null;
    const earliestB =
      occsB.length > 0 ? new Date(occsB[0].time).getTime() : null;
    if (earliestA === null && earliestB === null) return 0;
    if (earliestA === null) return 1;
    if (earliestB === null) return -1;
    return earliestA - earliestB;
  });
};

const appendEventIfNotSeen = (
  event: AvailableEvent | null | undefined,
  seenIds: Set<string>,
  target: AvailableEvent[]
) => {
  if (event?.id && !seenIds.has(event.id)) {
    seenIds.add(event.id);
    target.push(event);
  }
};

const extractEventsFromUpcomingNode = (
  node:
    | NonNullable<
        NonNullable<
          NonNullable<
            ChildAvailableOccurrencesQuery['child']
          >['upcomingEventsAndEventGroups']
        >['edges'][number]
      >['node']
    | undefined,
  seenIds: Set<string>,
  target: AvailableEvent[]
) => {
  if (!node) return;

  if (
    node.__typename === 'EventGroupNode' ||
    ('events' in node && Boolean(node.events))
  ) {
    const groupEvents = ('events' in node && node.events?.edges) || [];
    for (const groupEdge of groupEvents) {
      appendEventIfNotSeen(groupEdge?.node, seenIds, target);
    }
  } else {
    appendEventIfNotSeen(node as AvailableEvent, seenIds, target);
  }
};

export const extractAvailableEvents = (
  child?: ChildAvailableOccurrencesQuery['child'] | null
): AvailableEvent[] => {
  if (!child) {
    return [];
  }

  // Extract from upcomingEventsAndEventGroups (standalone events + event group events)
  if (child.upcomingEventsAndEventGroups?.edges) {
    const events: AvailableEvent[] = [];
    const seenIds = new Set<string>();

    for (const edge of child.upcomingEventsAndEventGroups.edges) {
      extractEventsFromUpcomingNode(edge?.node, seenIds, events);
    }

    return sortEventsByEarliestOccurrence(events);
  }

  // Fallback to legacy availableEvents
  if (child.availableEvents?.edges) {
    const events = child.availableEvents.edges
      .map((edge) => edge?.node)
      .filter((event): event is AvailableEvent => Boolean(event));

    return sortEventsByEarliestOccurrence(events);
  }

  return [];
};

/**
 * Determines whether a child is eligible to enrol in a given event.
 * An event is ineligible if the child is already enrolled in it or
 * if an enrolmentDeniedReason is present (e.g. season event chosen, yearly limit, registration not open).
 *
 * @param event - The event to check.
 * @param enrolledEventIds - Optional set of event IDs the child has already enrolled in.
 * @returns True if the child is eligible to enrol, false otherwise.
 */
export const isEventEligible = (
  event: AvailableEvent,
  enrolledEventIds?: Set<string>
): boolean => {
  if (enrolledEventIds?.has(event.id)) {
    return false;
  }
  if (event.ticketSystem?.childPassword) {
    return false;
  }
  return event.enrolmentDeniedReason === null;
};

export type EventOccurrencesSummary = {
  count: number;
  firstOccurrence: AvailableOccurrence | null;
  lastOccurrence: AvailableOccurrence | null;
  uniqueVenues: AvailableVenue[];
  uniqueLanguages: string[];
};

export const getEventOccurrencesSummary = (
  event: AvailableEvent
): EventOccurrencesSummary => {
  const sorted = getSortedEventOccurrences(event);
  const venueMap = new Map<string, AvailableVenue>();
  const languageSet = new Set<string>();

  for (const occ of sorted) {
    if (occ.venue && (occ.venue.name || occ.venue.address)) {
      const key = occ.venue.id || `${occ.venue.name}-${occ.venue.address}`;
      if (!venueMap.has(key)) {
        venueMap.set(key, occ.venue);
      }
    }
    if (occ.occurrenceLanguage) {
      languageSet.add(occ.occurrenceLanguage.toLowerCase());
    }
  }

  return {
    count: sorted.length,
    firstOccurrence: sorted[0] ?? null,
    lastOccurrence: sorted.at(-1) ?? null,
    uniqueVenues: Array.from(venueMap.values()),
    uniqueLanguages: Array.from(languageSet.values()),
  };
};

/**
 * Formats a user-friendly date and time string for an event card.
 * For single-occurrence events, returns date and time range (e.g. "Ma 5.10.2026, 10:00–11:00").
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
  const summary = getEventOccurrencesSummary(event);
  if (
    summary.count === 0 ||
    !summary.firstOccurrence ||
    !summary.lastOccurrence
  ) {
    return null;
  }
  if (summary.count === 1) {
    const dateStr = formatOccurrenceDateLong(
      summary.firstOccurrence.time,
      locale
    );
    const timeRange = formatOccurrenceTimeRange(
      summary.firstOccurrence.time,
      event.duration
    );
    const separator = t('common.dateTimeSeparator');
    return dateStr && timeRange
      ? `${dateStr} ${separator} ${timeRange}`
      : dateStr || timeRange;
  }
  const dateRange = formatOccurrenceDateRange(
    summary.firstOccurrence.time,
    summary.lastOccurrence.time
  );
  return t('search.card.dateRangeWithCount', {
    dateRange,
    count: summary.count,
  });
};

/**
 * Formats venue information for an event card.
 * For a single unique venue, combines name and address.
 * For multiple venues, returns comma-separated venue names.
 *
 * @param event - The event to format venue information for.
 * @returns Formatted venue string, or null if no venues are associated with the event.
 */
export const getEventVenueText = (event: AvailableEvent): string | null => {
  const summary = getEventOccurrencesSummary(event);
  if (summary.uniqueVenues.length === 0) return null;
  if (summary.uniqueVenues.length === 1) {
    const v = summary.uniqueVenues[0];
    return [v.name, v.address].filter(Boolean).join(', ');
  }
  return summary.uniqueVenues
    .map((v) => v.name || v.address)
    .filter(Boolean)
    .join(', ');
};

/**
 * Formats the unique spoken/performed languages for an event into a localized string.
 *
 * @param event - The event to format language information for.
 * @param t - i18next translation function.
 * @returns Localized languages string (e.g. "Kielet: Suomi, Ruotsi"), or null if no languages found.
 */
export const getEventLanguageText = (
  event: AvailableEvent,
  t: TFunction
): string | null => {
  const summary = getEventOccurrencesSummary(event);
  if (summary.uniqueLanguages.length === 0) return null;
  const translated = summary.uniqueLanguages
    .map((lang) => t(`common.language.${lang}`))
    .join(', ');
  return t('search.card.languages', { languages: translated });
};
