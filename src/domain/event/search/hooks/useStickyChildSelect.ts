import { useEffect, useRef, useState } from 'react';

/**
 * Hook to monitor whether the search form has scrolled past a sticky threshold.
 * Controls the visibility of the sticky child header bar when the user scrolls down to view results.
 *
 * @param offset - Distance in pixels from top of viewport to trigger sticky state. Defaults to 10.
 * @param externalRef - Optional external RefObject to observe instead of creating an internal ref.
 * @returns Object containing `childSelectRef` for the sentinel element and `isSticky` boolean.
 */
export function useStickyChildSelect<T extends HTMLElement = HTMLElement>(
  offset = 10,
  externalRef?: React.RefObject<T | null>
) {
  const [isSticky, setIsSticky] = useState(false);
  const internalRef = useRef<T>(null);
  const activeRef = externalRef || internalRef;

  useEffect(() => {
    const updateSticky = () => {
      if (window.scrollY <= 0) {
        setIsSticky(false);
        return;
      }
      const target = activeRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      // Activate when the bottom of the form sentinel has scrolled past the top threshold
      setIsSticky(rect.bottom <= offset);
    };

    updateSticky();
    window.addEventListener('scroll', updateSticky, { passive: true });
    window.addEventListener('resize', updateSticky, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateSticky);
      window.removeEventListener('resize', updateSticky);
    };
  }, [offset, activeRef]);

  return { isSticky, childSelectRef: activeRef };
}

export default useStickyChildSelect;

