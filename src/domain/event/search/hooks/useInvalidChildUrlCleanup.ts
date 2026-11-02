import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { useActiveChild } from './useActiveChild';

/**
 * Hook to sanitize the browser URL when a guardian visits a URL containing
 * an invalid or foreign child ID (i.e. not belonging to their authenticated profile).
 *
 * Automatically inspects active child state from `useActiveChild` and cleanses
 * query parameters using `useSearchParams`.
 */
export const useInvalidChildUrlCleanup = (): void => {
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();
  const { isInvalidChildInUrl, hasChildren } = useActiveChild();

  useEffect(() => {
    if (isInvalidChildInUrl && hasChildren) {
      toast.info(t('search.childNotFoundNotification'));
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('child');
          next.delete('childId');
          return next;
        },
        { replace: true }
      );
    }
  }, [isInvalidChildInUrl, hasChildren, setSearchParams, t]);
};

export default useInvalidChildUrlCleanup;
