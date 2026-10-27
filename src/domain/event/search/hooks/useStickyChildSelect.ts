import { useEffect, useRef, useState } from 'react';

/**
 * Hook to monitor whether the child selector has scrolled past a sticky threshold.
 * Controls the visibility of the sticky child header bar.
 *
 * @param offset - Distance in pixels from top of viewport to trigger sticky state. Defaults to 10.
 * @returns Object containing `childSelectRef` for the sentinel element and `isSticky` boolean.
 */
export function useStickyChildSelect<T extends HTMLElement = HTMLDivElement>(
  offset = 10
) {
  const [isSticky, setIsSticky] = useState(false);
  const childSelectRef = useRef<T>(null);

  useEffect(() => {
    const updateSticky = () => {
      if (window.scrollY <= 0) {
        setIsSticky(false);
        return;
      }
      const target = childSelectRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      setIsSticky(rect.top <= offset);
    };

    updateSticky();
    window.addEventListener('scroll', updateSticky, { passive: true });
    window.addEventListener('resize', updateSticky, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateSticky);
      window.removeEventListener('resize', updateSticky);
    };
  }, [offset]);

  return { isSticky, childSelectRef };
}

export default useStickyChildSelect;

