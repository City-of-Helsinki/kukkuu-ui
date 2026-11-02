import { useMemo } from 'react';

import { useProfileContext } from '../../../profile/hooks/useProfileContext';
import { useThemePathOptions } from '../hooks/useThemePathOptions';
import { useAccessibilityOptions } from '../hooks/useAccessibilityOptions';
import { useOccurrenceLanguageOptions } from '../hooks/useOccurrenceLanguageOptions';
import { useChildSelectOptions } from '../hooks/useChildSelectOptions';
import { useFilterBadges } from '../hooks/useFilterBadges';
import { useSearchDraftSync } from '../hooks/useSearchDraftSync';
import {
  EventSearchFormContext,
  EventSearchFormContextType,
} from './EventSearchFormContext';

/**
 * Props for {@link EventSearchFormProvider}.
 */
export type EventSearchFormProviderProps = {
  children: React.ReactNode;
};

/**
 * Provides state and actions for the event search form.
 *
 * Coordinates:
 * - Two-way draft state and URL synchronization via {@link useSearchDraftSync}
 * - Filter dropdown options and guardian child selection via {@link useChildSelectOptions}
 * - Active filter badges and focus continuity via {@link useFilterBadges}
 */
export const EventSearchFormProvider: React.FC<EventSearchFormProviderProps> = ({
  children,
}) => {
  const { profile } = useProfileContext();

  // --- Draft State, URL Synchronization & Form Actions ---
  const {
    draftChildId,
    setDraftChildId,
    draftFilters,
    committedFilters,
    submitButtonRef,
    updateDraftFilter,
    commitDirectFilterChange,
    submitSearch,
    clearAllFilters,
    applyThemePathFilter,
  } = useSearchDraftSync();

  // --- Option Hooks ---
  const { options: themePathOptions } = useThemePathOptions();
  const { options: accessibilityOptions } = useAccessibilityOptions();
  const { options: languageOptions } = useOccurrenceLanguageOptions();

  const {
    childrenOptions,
    selectedOptions: selectedChildOptions,
    handleChildChange,
  } = useChildSelectOptions({
    profile,
    childId: draftChildId,
    onChildSelect: setDraftChildId,
  });

  // --- Filter Badges Feature ---
  const { activeBadges, registerBadgeRef, removeBadge } = useFilterBadges({
    filters: committedFilters,
    themePathOptions,
    accessibilityOptions,
    languageOptions,
    fallbackFocusRef: submitButtonRef,
    onFilterChange: commitDirectFilterChange,
  });

  // Memoize context value to prevent unnecessary re-renders of the filter form tree
  const value = useMemo<EventSearchFormContextType>(
    () => ({
      draftFilters,
      childrenOptions,
      selectedChildOptions,
      handleChildChange,
      themePathOptions,
      accessibilityOptions,
      languageOptions,
      activeBadges,
      submitButtonRef,
      updateDraftFilter,
      submitSearch,
      removeBadge,
      clearAllFilters,
      applyThemePathFilter,
      registerBadgeRef,
    }),
    [
      draftFilters,
      childrenOptions,
      selectedChildOptions,
      handleChildChange,
      themePathOptions,
      accessibilityOptions,
      languageOptions,
      activeBadges,
      submitButtonRef,
      updateDraftFilter,
      submitSearch,
      removeBadge,
      clearAllFilters,
      applyThemePathFilter,
      registerBadgeRef,
    ]
  );

  return (
    <EventSearchFormContext.Provider value={value}>
      {children}
    </EventSearchFormContext.Provider>
  );
};

export default EventSearchFormProvider;
