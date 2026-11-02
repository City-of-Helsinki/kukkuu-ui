import {
  type Dispatch,
  type FormEvent,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useEventSearchUrlContext } from '../context/EventSearchUrlContext';
import { DEFAULT_SEARCH_FILTERS } from '../eventSearchUtils';
import type {
  EventSearchFilterKey,
  EventSearchFilters,
} from '../types/filterTypes';

export type UseSearchDraftSyncResult = {
  draftChildId: string;
  setDraftChildId: Dispatch<SetStateAction<string>>;
  draftFilters: EventSearchFilters;
  committedFilters: EventSearchFilters;
  submitButtonRef: RefObject<HTMLButtonElement | null>;
  updateDraftFilter: <K extends EventSearchFilterKey>(
    key: K,
    value: EventSearchFilters[K]
  ) => void;
  commitDirectFilterChange: (nextFilters: EventSearchFilters) => void;
  submitSearch: (e?: FormEvent) => void;
  clearAllFilters: () => void;
  applyThemePathFilter: (slug: string) => void;
};

/**
 * Manages two-way synchronization between form-local draft state (`draftChildId`, `draftFilters`)
 * and URL-committed search state (`EventSearchUrlContext`), along with form submission,
 * direct filter mutations, and submit button focus continuity.
 */
export const useSearchDraftSync = (): UseSearchDraftSyncResult => {
  const { activeChildId, committedFilters, commitSearchToUrl } =
    useEventSearchUrlContext();

  const [draftChildId, setDraftChildId] = useState<string>(
    () => activeChildId || ''
  );
  const [draftFilters, setDraftFilters] =
    useState<EventSearchFilters>(committedFilters);

  // Reference to the main submit button, used as a focus fallback target for accessibility
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // --- Synchronization (URL -> Draft) ---
  // Keeps draft state in sync whenever external navigation or URL updates occur
  useEffect(() => {
    if (activeChildId) {
      setDraftChildId(activeChildId);
    }
  }, [activeChildId]);

  useEffect(() => {
    setDraftFilters(committedFilters);
  }, [committedFilters]);

  /**
   * Updates a single draft filter property without committing to URL.
   * Invoked by form inputs (e.g. checkboxes, selects, date inputs).
   */
  const updateDraftFilter = useCallback(
    <K extends EventSearchFilterKey>(
      key: K,
      value: EventSearchFilters[K]
    ) => {
      setDraftFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  /**
   * Commits filter updates to both draft state and URL parameters immediately.
   * Reused across direct actions (badge removal, clear-all, and theme path banner).
   */
  const commitDirectFilterChange = useCallback(
    (nextFilters: EventSearchFilters) => {
      setDraftFilters(nextFilters);
      commitSearchToUrl(activeChildId || draftChildId, nextFilters);
    },
    [activeChildId, commitSearchToUrl, draftChildId]
  );

  /**
   * Commits the current draft form state to the URL, triggering an event search query
   * and updating the active filter badges.
   */
  const submitSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      commitSearchToUrl(draftChildId, draftFilters);
    },
    [commitSearchToUrl, draftChildId, draftFilters]
  );

  /**
   * Resets all search filters to their default values, commits immediately to URL,
   * and returns focus to the submit button for accessibility continuity.
   */
  const clearAllFilters = useCallback(() => {
    commitDirectFilterChange(DEFAULT_SEARCH_FILTERS);
    setTimeout(() => {
      submitButtonRef.current?.focus();
    }, 0);
  }, [commitDirectFilterChange]);

  /**
   * Quick-filter action: Sets theme path filter to a single slug and commits immediately.
   * Triggered by child theme path recommendation notifications/banners.
   */
  const applyThemePathFilter = useCallback(
    (slug: string) => {
      commitDirectFilterChange({
        ...committedFilters,
        themePaths: [slug],
      });
    },
    [commitDirectFilterChange, committedFilters]
  );

  return {
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
  };
};

export default useSearchDraftSync;
