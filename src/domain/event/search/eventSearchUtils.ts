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
export {
  EVENT_SEARCH_FILTER_KEYS,
  type EventSearchFilterKey,
} from './types/filterTypes';
export {
  BADGE_FILTER_REMOVERS,
  removeFilterByBadge,
} from './hooks/useFilterBadges';

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

export const DEFAULT_SEARCH_FILTERS: EventSearchFilters = {
  themePaths: [],
  startDate: '',
  accessibility: [],
  languages: [],
  availableOnly: false,
  familyOnly: false,
};

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
  const value = filters[key];
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return false;
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
 * Creates a Date instance representing the start of the specified day (00:00:00.000 local time),
 * ensuring the date components are valid (e.g. rejects non-existent dates like February 30).
 *
 * @param year - Full 4-digit calendar year.
 * @param monthIndex - Zero-based month index (0 for January, 11 for December).
 * @param day - Day of the month (1-31).
 * @returns A validated local Date object, or null if the date is invalid.
 */
export const createValidDate = (
  year: number,
  monthIndex: number,
  day: number
): Date | null => {
  const date = new Date(year, monthIndex, day, 0, 0, 0, 0);
  if (
    date.getFullYear() === year &&
    date.getMonth() === monthIndex &&
    date.getDate() === day
  ) {
    return date;
  }
  return null;
};

/**
 * Parses a Finnish date string ('DD.MM.YYYY' or 'D.M.YYYY') into a local start-of-day Date.
 * Validates calendar correctness (e.g., leap years and month lengths).
 *
 * @param dateStr - Finnish date string to parse.
 * @returns Valid Date object representing start of the day, or null if invalid or malformed.
 */
export const parseFinnishDate = (dateStr?: string | null): Date | null => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  const fiMatch = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(trimmed);
  if (!fiMatch) return null;

  const day = Number.parseInt(fiMatch[1], 10);
  const monthIndex = Number.parseInt(fiMatch[2], 10) - 1;
  const year = Number.parseInt(fiMatch[3], 10);

  return createValidDate(year, monthIndex, day);
};

/**
 * Parses an ISO 8601 date string ('YYYY-MM-DD') into a local start-of-day Date.
 * Validates calendar correctness (e.g., leap years and month lengths).
 *
 * @param dateStr - ISO date string to parse.
 * @returns Valid Date object representing start of the day, or null if invalid or malformed.
 */
export const parseIsoDate = (dateStr?: string | null): Date | null => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!isoMatch) return null;

  const year = Number.parseInt(isoMatch[1], 10);
  const monthIndex = Number.parseInt(isoMatch[2], 10) - 1;
  const day = Number.parseInt(isoMatch[3], 10);

  return createValidDate(year, monthIndex, day);
};

/**
 * Parses a date string formatted as either Finnish 'DD.MM.YYYY' or ISO 'YYYY-MM-DD'
 * into a local start-of-day Date object. Returns null if invalid.
 *
 * Evaluates Finnish format first, falling back to ISO format.
 *
 * @param dateStr - Date string in either Finnish or ISO format.
 * @returns Valid Date object, or null if neither matcher matches or the date is invalid.
 */
export const parseFilterStartDate = (dateStr?: string | null): Date | null => {
  return parseFinnishDate(dateStr) ?? parseIsoDate(dateStr);
};

/**
 * Converts an ISO date string (YYYY-MM-DD) into Finnish format (DD.MM.YYYY).
 */
export const formatIsoDateToFinnish = (isoStr?: string | null): string => {
  const d = parseFilterStartDate(isoStr);
  if (!d) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

/**
 * Converts a Finnish date string (DD.MM.YYYY) into ISO format (YYYY-MM-DD).
 */
export const formatFinnishDateToIso = (fiStr?: string | null): string => {
  const d = parseFilterStartDate(fiStr);
  if (!d) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

/**
 * Parses and sanitizes search filter values from URLSearchParams.
 * Accepts both repeated parameters and comma-separated values, and both ISO and Finnish date strings.
 */
export const parseSearchFiltersFromUrl = (
  searchParams: URLSearchParams,
  validOptions?: {
    themePaths?: string[];
    accessibility?: string[];
    languages?: string[];
  }
): EventSearchFilters => {
  const extractValues = (keys: string[]): string[] => {
    const raw: string[] = [];
    for (const key of keys) {
      for (const val of searchParams.getAll(key)) {
        for (const part of val.split(',')) {
          const trimmed = part.trim();
          if (trimmed) raw.push(trimmed);
        }
      }
    }
    return Array.from(new Set(raw));
  };

  const rawThemePaths = extractValues(['themePath', 'themePaths']);
  const themePaths = validOptions?.themePaths
    ? rawThemePaths.filter((slug) => validOptions.themePaths?.includes(slug))
    : rawThemePaths;

  const rawAccessibility = extractValues(['accessibility']);
  const accessibility = validOptions?.accessibility
    ? rawAccessibility.filter((item) =>
        validOptions.accessibility?.includes(item)
      )
    : rawAccessibility;

  const rawLanguages = extractValues(['language', 'languages']).map((l) =>
    l.toLowerCase()
  );
  const languages = validOptions?.languages
    ? rawLanguages.filter((lang) =>
        validOptions.languages?.map((l) => l.toLowerCase()).includes(lang)
      )
    : rawLanguages;

  const rawDate = searchParams.get('startDate') || searchParams.get('date');
  const parsedDate = parseFilterStartDate(rawDate);
  const startDate = parsedDate ? formatIsoDateToFinnish(rawDate) : '';

  const availableOnly = searchParams.get('availableOnly') === 'true';
  const familyOnly = searchParams.get('familyOnly') === 'true';

  return {
    themePaths,
    startDate,
    accessibility,
    languages,
    availableOnly,
    familyOnly,
  };
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

  params.delete('themePath');
  params.delete('themePaths');
  for (const slug of filters.themePaths) {
    params.append('themePath', slug);
  }

  params.delete('startDate');
  params.delete('date');
  if (filters.startDate) {
    const isoDate = formatFinnishDateToIso(filters.startDate);
    if (isoDate) {
      params.set('startDate', isoDate);
    }
  }

  params.delete('accessibility');
  for (const acc of filters.accessibility) {
    params.append('accessibility', acc);
  }

  params.delete('language');
  params.delete('languages');
  for (const lang of filters.languages) {
    params.append('language', lang.toLowerCase());
  }

  if (filters.availableOnly) {
    params.set('availableOnly', 'true');
  } else {
    params.delete('availableOnly');
  }

  if (filters.familyOnly) {
    params.set('familyOnly', 'true');
  } else {
    params.delete('familyOnly');
  }
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

/**
 * Filters available events by combining event-level and occurrence-level criteria.
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
    // availableOnly: eligibility + not full
    if (filters.availableOnly) {
      if (!isEventEligible(event, enrolledEventIds)) {
        return false;
      }
      if (!isEventNotFull(event)) {
        return false;
      }
    }

    // familyOnly: participantsPerInvite === Family
    if (filters.familyOnly) {
      if (event.participantsPerInvite !== EventParticipantsPerInvite.Family) {
        return false;
      }
    }

    // themePaths: event must have matching themePath slug
    if (filters.themePaths && filters.themePaths.length > 0) {
      const eventSlugs = (event.themePaths || [])
        .map((tp) => tp?.slug)
        .filter((s): s is string => Boolean(s));
      if (eventSlugs.length === 0) {
        return false;
      }
      const matchesTheme = filters.themePaths.some((slug) =>
        eventSlugs.includes(slug)
      );
      if (!matchesTheme) {
        return false;
      }
    }

    // accessibility: event must have matching accessibility attribute
    if (filters.accessibility && filters.accessibility.length > 0) {
      const eventAcc = (event.accessibility || []).filter(Boolean);
      if (eventAcc.length === 0) {
        return false;
      }
      const matchesAcc = filters.accessibility.some((acc) =>
        eventAcc.includes(acc)
      );
      if (!matchesAcc) {
        return false;
      }
    }

    // Occurrence-level criteria: at least one upcoming occurrence must satisfy all occurrence filters simultaneously
    if (hasOccurrenceFilters) {
      const occurrences = (event.occurrences?.edges || [])
        .map((e) => e?.node)
        .filter((occ): occ is AvailableOccurrence => Boolean(occ));

      if (occurrences.length === 0) {
        // If event has no occurrences, it cannot match date or language criteria
        if (parsedStartDate || filterLanguages.length > 0) {
          return false;
        }
      } else {
        const hasMatchingOccurrence = occurrences.some((occ) =>
          doesOccurrenceMatchFilters(occ, {
            startDate: parsedStartDate,
            languages: filterLanguages,
            availableOnly: filters.availableOnly,
          })
        );
        if (!hasMatchingOccurrence) {
          return false;
        }
      }
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
