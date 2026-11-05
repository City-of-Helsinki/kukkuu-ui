import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useEventSearchUrlContext } from './EventSearchUrlContext';
import { useEventsSearch } from '../hooks/useEventsSearch';
import { useActiveChildName } from '../hooks/useActiveChildName';
import { useSearchFormSticky } from '../hooks/useSearchFormSticky';
import { useChildThemePathNotice } from '../hooks/useChildThemePathNotice';
import {
  EventSearchResultsUiContext,
  type EventSearchResultsUiContextType,
} from './EventSearchResultsUiContext';

export type EventSearchResultsUiProviderProps = {
  children: React.ReactNode;
};

/**
 * Context provider that manages and distributes search results, active child metadata,
 * pagination state, sticky header state, dismissible notifications, and screen reader announcements.
 *
 * Coordinates data fetching via `useEventsSearch`, tracks scroll position for the sticky header,
 * and exposes action handlers to child components.
 */
export const EventSearchResultsUiProvider: React.FC<
  EventSearchResultsUiProviderProps
> = ({ children }) => {
  const { t } = useTranslation();
  const { activeChildId, committedFilters } = useEventSearchUrlContext();

  // Fetch filtered and paginated events from Apollo query
  const eventsSearch = useEventsSearch({
    childId: activeChildId,
    filters: committedFilters,
    skip: !activeChildId,
  });

  // Resolve active child display name
  const activeChildName = useActiveChildName(eventsSearch.child);

  // Sticky header scroll observation and keyboard focus management
  const { searchFormRef, isSticky, focusChildSelector } = useSearchFormSticky();

  // Predefined theme path notification state and dismissal
  // (ChildNode.themePath is not yet exposed by the backend schema; passes undefined until supported)
  const { visibleChildThemePath, dismissThemePathNotice } =
    useChildThemePathNotice(undefined);

  // Accessible aria-live screen reader announcement
  const resultsAnnouncement = useMemo(() => {
    return t('search.results.announcement', {
      count: eventsSearch.totalCount,
      name: activeChildName,
    });
  }, [eventsSearch.totalCount, activeChildName, t]);

  const value = useMemo<EventSearchResultsUiContextType>(
    () => ({
      child: eventsSearch.child,
      activeChildName,
      events: eventsSearch.events,
      totalCount: eventsSearch.totalCount,
      remainingCount: eventsSearch.remainingCount,
      hasMore: eventsSearch.hasMore,
      loadMore: eventsSearch.loadMore,
      isLoading: eventsSearch.loading,
      error: eventsSearch.error,
      isSticky,
      searchFormRef,
      focusChildSelector,
      visibleChildThemePath,
      dismissThemePathNotice,
      resultsAnnouncement,
    }),
    [
      eventsSearch.child,
      activeChildName,
      eventsSearch.events,
      eventsSearch.totalCount,
      eventsSearch.remainingCount,
      eventsSearch.hasMore,
      eventsSearch.loadMore,
      eventsSearch.loading,
      eventsSearch.error,
      isSticky,
      searchFormRef,
      focusChildSelector,
      visibleChildThemePath,
      dismissThemePathNotice,
      resultsAnnouncement,
    ]
  );

  return (
    <EventSearchResultsUiContext.Provider value={value}>
      {children}
    </EventSearchResultsUiContext.Provider>
  );
};

export default EventSearchResultsUiProvider;
