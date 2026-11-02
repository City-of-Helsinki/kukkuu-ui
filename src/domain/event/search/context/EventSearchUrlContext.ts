import { createContext, useContext } from 'react';

import type { EventSearchFilters } from '../types/filterTypes';

export type EventSearchUrlContextType = {
  activeChildId: string | undefined;
  committedFilters: EventSearchFilters;
  hasChildren: boolean;
  commitSearchToUrl: (childId: string, filters: EventSearchFilters) => void;
};

export const EventSearchUrlContext =
  createContext<EventSearchUrlContextType | null>(null);

export function useEventSearchUrlContext(): EventSearchUrlContextType {
  const context = useContext(EventSearchUrlContext);
  if (!context) {
    throw new Error(
      'useEventSearchUrlContext must be used within an EventSearchUrlProvider'
    );
  }
  return context;
}
