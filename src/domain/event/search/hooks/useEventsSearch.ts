import { useCallback, useMemo, useRef } from 'react';
import {
  ApolloError,
  NetworkStatus,
  useQuery,
  type WatchQueryFetchPolicy,
} from '@apollo/client';

import useDefaultErrorHandler from '../../../api/useDefaultErrorHandler';
import { eventsSearchQuery } from '../../queries/eventsSearchQuery';
import type {
  AvailableEvent,
  EventsSearchQuery,
  EventsSearchQueryVariables,
} from '../../types/EventsSearchTypes';
import {
  DEFAULT_SEARCH_PAGE_SIZE,
  extractSearchEvents,
  formatFinnishDateToIso,
} from '../eventSearchUtils';
import type { EventSearchFilters } from '../types/filterTypes';

export type UseEventsSearchOptions = {
  childId?: string;
  pageSize?: number;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
  availableOnly?: boolean;
  filters?: Partial<EventSearchFilters>;
};

export type UseEventsSearchResult = {
  child: EventsSearchQuery['child'] | null;
  events: AvailableEvent[];
  totalCount: number;
  remainingCount: number;
  hasMore: boolean;
  loadMore: () => void;
  loading: boolean;
  error?: ApolloError;
};

/**
 * Hook to fetch filtered, sorted, and cursor-paginated events for a child from the GraphQL API.
 */
export const useEventsSearch = ({
  childId,
  pageSize = DEFAULT_SEARCH_PAGE_SIZE,
  skip = false,
  fetchPolicy,
  availableOnly = false,
  filters,
}: UseEventsSearchOptions): UseEventsSearchResult => {
  const isFetchingMoreRef = useRef(false);
  const handleError = useDefaultErrorHandler();

  const variables = useMemo<EventsSearchQueryVariables>(() => {
    const isoStartDate = filters?.startDate
      ? formatFinnishDateToIso(filters.startDate) || undefined
      : undefined;

    return {
      childId: childId || '',
      first: pageSize,
      startDate: isoStartDate,
      languages:
        filters?.languages && filters.languages.length > 0
          ? filters.languages
          : undefined,
      themePaths:
        filters?.themePaths && filters.themePaths.length > 0
          ? filters.themePaths
          : undefined,
      accessibility:
        filters?.accessibility && filters.accessibility.length > 0
          ? filters.accessibility
          : undefined,
      familyOnly: filters?.familyOnly ? true : undefined,
      availableOnly:
        (filters?.availableOnly ?? availableOnly) ? true : undefined,
    };
  }, [childId, pageSize, filters, availableOnly]);

  const {
    data,
    loading: queryLoading,
    networkStatus,
    error,
    fetchMore,
  } = useQuery<
    EventsSearchQuery,
    EventsSearchQueryVariables
  >(eventsSearchQuery, {
    skip: skip || !childId,
    variables,
    fetchPolicy,
    notifyOnNetworkStatusChange: true,
  });

  const loading = queryLoading && networkStatus !== NetworkStatus.fetchMore;

  const events: AvailableEvent[] = useMemo(
    () => extractSearchEvents(data?.events),
    [data?.events]
  );

  const totalCount = data?.events?.count ?? events.length;
  const hasMore = Boolean(data?.events?.pageInfo?.hasNextPage);
  const endCursor = data?.events?.pageInfo?.endCursor;
  const remainingCount = Math.max(0, totalCount - events.length);

  const loadMore = useCallback(() => {
    if (!hasMore || !endCursor || queryLoading || isFetchingMoreRef.current) {
      return;
    }
    isFetchingMoreRef.current = true;
    void fetchMore({
      variables: {
        after: endCursor,
      },
    })
      .catch((err: unknown) => {
        handleError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        isFetchingMoreRef.current = false;
      });
  }, [hasMore, endCursor, queryLoading, fetchMore, handleError]);

  return {
    child: data?.child ?? null,
    events,
    totalCount,
    remainingCount,
    hasMore,
    loadMore,
    loading,
    error,
  };
};

export default useEventsSearch;
