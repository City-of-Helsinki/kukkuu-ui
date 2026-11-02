import { createContext, useContext } from 'react';

import { ChildSelectOption } from '../hooks/useChildSelectOptions';
import type {
  EventSearchFilters,
  EventSearchFilterKey,
  FilterBadgeItem,
  FilterOption,
} from '../types/filterTypes';

/**
 * Context state and actions provided by {@link EventSearchFormProvider}.
 */
export type EventSearchFormContextType = {
  /** Current search filter values in the search form draft state. */
  draftFilters: EventSearchFilters;
  /** Dropdown options for all children belonging to the current guardian. */
  childrenOptions: ChildSelectOption[];
  /** Currently selected child option formatted for HDS Select component. */
  selectedChildOptions: ChildSelectOption[];
  /** Handler invoked when a child is selected from the dropdown. */
  handleChildChange: (
    selected:
      | ChildSelectOption
      | ChildSelectOption[]
      | string
      | null
      | undefined
  ) => void;
  /** Available theme path filter options. */
  themePathOptions: FilterOption[];
  /** Available accessibility filter options. */
  accessibilityOptions: FilterOption[];
  /** Available occurrence language filter options. */
  languageOptions: FilterOption[];
  /** Active filter badges derived from committed filter values currently affecting search results. */
  activeBadges: FilterBadgeItem[];
  /** Ref to the search form submit button, used as a focus continuity target. */
  submitButtonRef: React.RefObject<HTMLButtonElement | null>;
  /** Updates a single draft filter property without committing to the URL. */
  updateDraftFilter: <K extends EventSearchFilterKey>(
    key: K,
    value: EventSearchFilters[K]
  ) => void;
  /** Commits the draft child ID and filter values to the URL. */
  submitSearch: (e?: React.FormEvent) => void;
  /** Removes a specific filter badge, immediately committing changes to the URL and shifting focus cleanly. */
  removeBadge: (badge: FilterBadgeItem) => void;
  /** Resets all search filters to defaults, commits to URL, and refocuses the submit button. */
  clearAllFilters: () => void;
  /** Applies a single theme path filter immediately and commits to the URL. */
  applyThemePathFilter: (slug: string) => void;
  /** Registers/unregisters a DOM element reference for a badge to maintain focus continuity upon deletion. */
  registerBadgeRef: (id: string, el: HTMLElement | null) => void;
};

export const EventSearchFormContext =
  createContext<EventSearchFormContextType | null>(null);

export function useEventSearchFormContext(): EventSearchFormContextType {
  const context = useContext(EventSearchFormContext);
  if (!context) {
    throw new Error(
      'useEventSearchFormContext must be used within an EventSearchFormProvider'
    );
  }
  return context;
}
