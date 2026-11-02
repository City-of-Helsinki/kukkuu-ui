import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

import {
  parseSearchFiltersFromUrl,
  writeSearchFiltersToUrlParams,
} from '../eventSearchUtils';
import type { EventSearchFilters } from '../types/filterTypes';

export type UseSearchUrlParamsSyncResult = {
  searchParams: URLSearchParams;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
  committedFilters: EventSearchFilters;
  commitSearchToUrl: (childId: string, filters: EventSearchFilters) => void;
};

/**
 * Hook to synchronize search filters with URLSearchParams.
 *
 * Parses committed filters from the active URL query string,
 * and provides a callback to push updated filter parameters to the browser history.
 *
 * @returns Parsed filter state, search params setter, and URL mutation callback.
 */
export const useSearchUrlParamsSync = (): UseSearchUrlParamsSyncResult => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const committedFilters = useMemo(
    () => parseSearchFiltersFromUrl(searchParams),
    [searchParams]
  );

  const commitSearchToUrl = useCallback(
    (childId: string, filters: EventSearchFilters) => {
      const nextParams = new URLSearchParams();
      writeSearchFiltersToUrlParams(nextParams, childId, filters);
      navigate(
        {
          pathname: location.pathname,
          search: nextParams.toString() ? `?${nextParams.toString()}` : '',
        },
        { replace: false }
      );
    },
    [location.pathname, navigate]
  );

  return {
    searchParams,
    setSearchParams,
    committedFilters,
    commitSearchToUrl,
  };
};

export default useSearchUrlParamsSync;
