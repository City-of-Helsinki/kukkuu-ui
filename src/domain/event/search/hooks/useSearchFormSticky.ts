import React, { useCallback, useRef } from 'react';

import { useStickyChildSelect } from './useStickyChildSelect';

export type UseSearchFormStickyResult = {
  searchFormRef: React.RefObject<HTMLFormElement | null>;
  isSticky: boolean;
  focusChildSelector: () => void;
};

/**
 * Hook to manage sticky scroll observation and keyboard focus management
 * for the event search filter form.
 *
 * Provides a DOM ref to attach to the search filter form, an `isSticky` indicator
 * for displaying the sticky top bar, and a callback to smoothly scroll back to
 * the form and focus the child selector dropdown.
 *
 * @param threshold - Top offset in pixels before sticky activates (default: 10).
 * @returns Ref for search form, sticky state boolean, and child selector focus handler.
 */
export const useSearchFormSticky = (
  threshold = 10
): UseSearchFormStickyResult => {
  const searchFormRef = useRef<HTMLFormElement>(null);
  const { isSticky } = useStickyChildSelect(threshold, searchFormRef);

  const focusChildSelector = useCallback(() => {
    if (searchFormRef.current) {
      searchFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      const selectorButton = searchFormRef.current.querySelector<HTMLElement>(
        '#child-selector, button[id*="child-selector"]'
      );
      if (selectorButton) {
        selectorButton.focus();
      }
    }
  }, []);

  return {
    searchFormRef,
    isSticky,
    focusChildSelector,
  };
};

export default useSearchFormSticky;

