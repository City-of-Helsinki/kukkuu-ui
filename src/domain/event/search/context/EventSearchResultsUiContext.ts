import React, { createContext, useContext } from 'react';
import { ApolloError } from '@apollo/client';

import type {
  AvailableEvent,
  EventsSearchQuery,
} from '../../types/EventsSearchTypes';

export type EventSearchResultsUiContextType = {
  child: EventsSearchQuery['child'] | null;
  activeChildName: string;
  events: AvailableEvent[];
  totalCount: number;
  remainingCount: number;
  hasMore: boolean;
  loadMore: () => void;
  isLoading: boolean;
  error?: ApolloError;
  isSticky: boolean;
  searchFormRef: React.RefObject<HTMLFormElement | null>;
  focusChildSelector: () => void;
  visibleChildThemePath: { slug: string; name: string } | null;
  dismissThemePathNotice: () => void;
  resultsAnnouncement: string;
};

export const EventSearchResultsUiContext =
  createContext<EventSearchResultsUiContextType | null>(null);

/**
 * Consumes {@link EventSearchResultsUiContext} and throws if called outside an `EventSearchResultsUiProvider`.
 */
export function useEventSearchResultsUiContext(): EventSearchResultsUiContextType {
  const context = useContext(EventSearchResultsUiContext);
  if (!context) {
    throw new Error(
      'useEventSearchResultsUiContext must be used within an EventSearchResultsUiProvider'
    );
  }
  return context;
}
