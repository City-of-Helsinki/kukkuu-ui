import React, { useCallback, useMemo, useState } from 'react';

import { EventSearchUrlContext } from '../context/EventSearchUrlContext';

export type ChildThemePathInfo = {
  slug: string;
  name: string;
};

export type UseChildThemePathNoticeResult = {
  visibleChildThemePath: ChildThemePathInfo | null;
  dismissThemePathNotice: () => void;
};

/**
 * Hook to manage visibility and user dismissal of a child's assigned theme path notification.
 *
 * Automatically pulls activeChildId and active theme path filters from `EventSearchUrlContext`,
 * and hides the banner if:
 * 1. The user has already active-filtered results by this theme path slug.
 * 2. The user has dismissed the notification for this specific child.
 *
 * @param themePath - Child's assigned theme path.
 * @returns Visible theme path (or null if hidden/dismissed) and notice dismissal callback.
 */
export const useChildThemePathNotice = (
  themePath?: ChildThemePathInfo | null
): UseChildThemePathNoticeResult => {
  const urlContext = React.useContext(EventSearchUrlContext);

  const activeChildId = urlContext?.activeChildId;
  const activeThemePaths = urlContext?.committedFilters.themePaths;

  const [dismissedThemePaths, setDismissedThemePaths] = useState<
    Record<string, boolean>
  >({});

  const visibleChildThemePath = useMemo(() => {
    if (!themePath?.slug || !activeChildId) {
      return null;
    }
    // Hidden if the theme path is already active in current search filters
    if (activeThemePaths?.includes(themePath.slug)) {
      return null;
    }
    // Hidden if explicitly dismissed by the user for this child
    const dismissKey = `${activeChildId}-${themePath.slug}`;
    if (dismissedThemePaths[dismissKey]) {
      return null;
    }
    return themePath;
  }, [themePath, activeThemePaths, activeChildId, dismissedThemePaths]);

  const dismissThemePathNotice = useCallback(() => {
    if (themePath?.slug && activeChildId) {
      const dismissKey = `${activeChildId}-${themePath.slug}`;
      setDismissedThemePaths((prev) => ({
        ...prev,
        [dismissKey]: true,
      }));
    }
  }, [themePath, activeChildId]);

  return {
    visibleChildThemePath,
    dismissThemePathNotice,
  };
};

export default useChildThemePathNotice;
