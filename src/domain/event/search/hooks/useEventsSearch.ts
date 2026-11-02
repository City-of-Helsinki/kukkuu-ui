import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ApolloError,
  useQuery,
  type WatchQueryFetchPolicy,
} from '@apollo/client';

import { childAvailableEventsQuery } from '../../queries/childAvailableEventsQuery';
import type {
  AvailableEvent,
  ChildAvailableOccurrencesQuery,
  ChildAvailableOccurrencesQueryVariables,
} from '../../types/ChildAvailableOccurrencesTypes';
import {
  DEFAULT_SEARCH_PAGE_SIZE,
  extractAvailableEvents,
  filterAvailableEvents,
  isEventEligible,
  paginateSearchItems,
} from '../eventSearchUtils';
import type { EventSearchFilters } from '../types/filterTypes';

export type UseEventsSearchOptions = {
  childId?: string;
  pageSize?: number;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
  availableOnly?: boolean;
  filters?: Partial<EventSearchFilters>;
  enrolledEventIds?: Set<string>;
};

export type UseEventsSearchResult = {
  child: ChildAvailableOccurrencesQuery['child'] | null;
  events: AvailableEvent[];
  allEvents: AvailableEvent[];
  totalCount: number;
  remainingCount: number;
  hasMore: boolean;
  loadMore: () => void;
  loading: boolean;
  error?: ApolloError;
};

/**
 * Hook to fetch available events for a specific child directly from Apollo Client query / cache.
 *
 * Extracts available events from GraphQL query data, applies active search filters,
 * and paginates the visible items by page size with a loadMore action.
 *
 * @param options - Configuration options for the events search query.
 * @param options.childId - ID of the child whose events are being queried.
 * @param options.pageSize - Number of items displayed per page (default: 15).
 * @param options.skip - When true, skips executing the GraphQL query.
 * @param options.fetchPolicy - Optional Apollo Client cache watch policy.
 * @returns Query state, paginated events, remaining count, loadMore handler, and error state.
 */
export const useEventsSearch = ({
  childId,
  pageSize = DEFAULT_SEARCH_PAGE_SIZE,
  skip = false,
  fetchPolicy,
  availableOnly = false,
  filters,
  enrolledEventIds,
}: UseEventsSearchOptions): UseEventsSearchResult => {
  const [page, setPage] = useState(1);

  // Reset pagination to page 1 whenever childId, filters, or availableOnly change
  useEffect(() => {
    setPage(1);
  }, [childId, filters, availableOnly]);

  const { data, loading, error } = useQuery<
    ChildAvailableOccurrencesQuery,
    ChildAvailableOccurrencesQueryVariables
  >(childAvailableEventsQuery, {
    skip: skip || !childId,
    variables: { id: childId || '' },
    fetchPolicy,
  });

  const rawEvents: AvailableEvent[] = useMemo(
    () => extractAvailableEvents(data?.child),
    [data?.child]
  );

  const allEvents: AvailableEvent[] = useMemo(() => {
    if (filters) {
      return filterAvailableEvents(rawEvents, filters, enrolledEventIds);
    }
    if (!availableOnly) {
      return rawEvents;
    }
    return rawEvents.filter((ev) => isEventEligible(ev, enrolledEventIds));
  }, [rawEvents, filters, availableOnly, enrolledEventIds]);

  const pagination = useMemo(
    () => paginateSearchItems(allEvents, page, pageSize),
    [allEvents, page, pageSize]
  );

  const loadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  return {
    child: data?.child ?? null,
    events: pagination.items,
    allEvents: pagination.allItems,
    totalCount: pagination.totalCount,
    remainingCount: pagination.remainingCount,
    hasMore: pagination.hasMore,
    loadMore,
    loading,
    error,
  };
};

export default useEventsSearch;
