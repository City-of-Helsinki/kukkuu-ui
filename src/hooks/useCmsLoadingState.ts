import { useMemo } from 'react';

export interface CmsQueryState<T = unknown> {
  loading: boolean;
  data?: T | null;
  error?: unknown;
}

export interface CmsLoadingState {
  /**
   * True only during cold initial loads when no cached data is available yet.
   * False during background Stale-While-Revalidate (SWR) refetches when data already exists.
   */
  isInitialLoading: boolean;
  /**
   * True if the query returned a GraphQL or network error.
   */
  hasError: boolean;
}

/**
 * Pure utility function to evaluate the loading state of a CMS query.
 */
export function getCmsLoadingState<T = unknown>(
  queryResult: CmsQueryState<T>
): CmsLoadingState {
  const { loading, data, error } = queryResult;
  return {
    isInitialLoading: Boolean(loading && !data),
    hasError: Boolean(error),
  };
}

/**
 * Evaluates the loading state of a CMS Apollo query to distinguish cold initial
 * loads from background Stale-While-Revalidate (SWR) refetches.
 *
 * WHY: When Apollo refetches queries in the background (such as during Stale-While-Revalidate
 * or cache updates), `loading` is set to `true` while `data` already exists in the cache.
 * Checking `loading && !data` ensures that components only display skeleton placeholders
 * on initial cold visits when no data is available, preventing the UI from flashing back
 * to skeletons during silent background revalidations.
 */
export function useCmsLoadingState<T = unknown>(
  queryResult: CmsQueryState<T>
): CmsLoadingState {
  const { loading, data, error } = queryResult;
  return useMemo(
    () => getCmsLoadingState({ loading, data, error }),
    [loading, data, error]
  );
}

export default useCmsLoadingState;
