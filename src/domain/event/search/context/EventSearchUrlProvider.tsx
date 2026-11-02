import React, { useMemo } from 'react';

import { useActiveChild } from '../hooks/useActiveChild';
import { useInvalidChildUrlCleanup } from '../hooks/useInvalidChildUrlCleanup';
import { useSearchUrlParamsSync } from '../hooks/useSearchUrlParamsSync';
import {
  EventSearchUrlContext,
  EventSearchUrlContextType,
} from './EventSearchUrlContext';

export type EventSearchUrlProviderProps = {
  children: React.ReactNode;
};

/**
 * Context provider that manages URL-synchronized state for the event search feature.
 *
 * Coordinates reading/writing search filters to query parameters and sanitizes
 * invalid or foreign child IDs from the URL by falling back to the guardian's first child.
 *
 * @param props - Component props containing children to render.
 */
export const EventSearchUrlProvider: React.FC<EventSearchUrlProviderProps> = ({
  children,
}) => {
  const { activeChildId, hasChildren } = useActiveChild();
  const { committedFilters, commitSearchToUrl } = useSearchUrlParamsSync();
  useInvalidChildUrlCleanup();

  const value = useMemo<EventSearchUrlContextType>(
    () => ({
      activeChildId,
      committedFilters,
      hasChildren,
      commitSearchToUrl,
    }),
    [activeChildId, committedFilters, hasChildren, commitSearchToUrl]
  );

  return (
    <EventSearchUrlContext.Provider value={value}>
      {children}
    </EventSearchUrlContext.Provider>
  );
};

export default EventSearchUrlProvider;
