import React, { useMemo } from 'react';

import { ProfileContext } from '../../../profile/ProfileContext';
import { EventSearchUrlContext } from '../context/EventSearchUrlContext';
import type { EventsSearchQuery } from '../../types/EventsSearchTypes';

/**
 * Resolves the display name of the currently active child.
 *
 * Prioritizes the name returned from the event search query node,
 * falling back to finding the child by ID within the guardian's profile.
 * Automatically resolves profile and activeChildId from context.
 *
 * @param searchChild - Child node from search results query.
 * @returns The resolved child name or an empty string if unresolved.
 */
export const useActiveChildName = (
  searchChild?: EventsSearchQuery['child'] | null
): string => {
  const profileContext = React.useContext(ProfileContext);
  const urlContext = React.useContext(EventSearchUrlContext);

  const profile = profileContext?.profile;
  const activeChildId = urlContext?.activeChildId;

  return useMemo(() => {
    if (searchChild?.name) {
      return searchChild.name;
    }
    if (!profile || !activeChildId) {
      return '';
    }
    const match = (profile.children?.edges || [])
      .map((edge) => edge?.node)
      .find((c) => c?.id === activeChildId);
    return match?.name || '';
  }, [searchChild?.name, profile, activeChildId]);
};

export default useActiveChildName;
