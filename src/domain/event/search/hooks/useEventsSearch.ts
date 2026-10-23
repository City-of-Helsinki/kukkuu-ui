import { useMemo } from 'react';
import {
  ApolloError,
  DocumentNode,
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
  paginateSearchItems,
} from '../eventSearchUtils';

export type UseEventsSearchOptions = {
  childId?: string;
  page?: number;
  pageSize?: number;
  skip?: boolean;
  query?: DocumentNode;
  fetchPolicy?: WatchQueryFetchPolicy;
};

export type UseEventsSearchResult = {
  child: ChildAvailableOccurrencesQuery['child'] | null;
  events: AvailableEvent[];
  allEvents: AvailableEvent[];
  totalCount: number;
  remainingCount: number;
  hasMore: boolean;
  loading: boolean;
  error?: ApolloError;
};

/**
 * Hook to fetch and paginate available events for a specific child.
 *
 * Extracts available events from GraphQL query data, sorts them by their earliest occurrence,
 * and paginates the results according to the requested page index and page size.
 *
 * @param options - Configuration options for the search query and pagination.
 * @param options.childId - ID of the child whose events are being queried.
 * @param options.page - Current page number (1-based, default: 1).
 * @param options.pageSize - Number of items displayed per page (default: 15).
 * @param options.skip - When true, skips executing the GraphQL query.
 * @param options.query - Optional GraphQL DocumentNode override (defaults to childAvailableEventsQuery).
 * @param options.fetchPolicy - Optional Apollo Client cache watch policy.
 * @returns Query state, current page's events, total sorted events, pagination counts, and error.
 */
export const useEventsSearch = ({
  childId,
  page = 1,
  pageSize = DEFAULT_SEARCH_PAGE_SIZE,
  skip = false,
  query = childAvailableEventsQuery,
  fetchPolicy,
}: UseEventsSearchOptions): UseEventsSearchResult => {
  const { data, loading, error } = useQuery<
    ChildAvailableOccurrencesQuery,
    ChildAvailableOccurrencesQueryVariables
  >(query, {
    skip: skip || !childId,
    variables: { id: childId || '' },
    fetchPolicy,
  });

  const allEvents: AvailableEvent[] = useMemo(
    () => extractAvailableEvents(data?.child),
    [data?.child]
  );

  const pagination = useMemo(
    () => paginateSearchItems(allEvents, page, pageSize),
    [allEvents, page, pageSize]
  );

  return {
    child: data?.child ?? null,
    events: pagination.items,
    allEvents: pagination.allItems,
    totalCount: pagination.totalCount,
    remainingCount: pagination.remainingCount,
    hasMore: pagination.hasMore,
    loading,
    error,
  };
};

export default useEventsSearch;
