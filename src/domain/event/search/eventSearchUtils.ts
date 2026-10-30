import type { TFunction } from 'i18next';

import {
  formatOccurrenceDateLong,
  formatOccurrenceDateRange,
  formatOccurrenceTimeRange,
} from '../../../common/time/occurrenceTime';
import type {
  AvailableEvent,
  AvailableOccurrence,
  AvailableVenue,
  ChildAvailableOccurrencesQuery,
} from '../types/ChildAvailableOccurrencesTypes';

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
    const separator = t('common.dateTimeSeparator', 'klo');
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
