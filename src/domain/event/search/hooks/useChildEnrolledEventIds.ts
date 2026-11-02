import React, { useMemo } from 'react';

import {
  ProfileContext,
  type ProfileType,
} from '../../../profile/ProfileContext';
import { EventSearchUrlContext } from '../context/EventSearchUrlContext';

/**
 * Pure utility function to extract the set of event IDs that the given child is enrolled in.
 *
 * @param profile - Guardian's profile containing children and enrolments.
 * @param activeChildId - ID of the active child.
 * @returns Set of event IDs the child is already enrolled in.
 */
export const extractEnrolledEventIds = (
  profile?: ProfileType | null,
  activeChildId?: string | null
): Set<string> => {
  if (!profile || !activeChildId) {
    return new Set<string>();
  }

  const childNode = (profile.children?.edges || [])
    .map((edge) => edge?.node)
    .find((c) => c?.id === activeChildId);

  const ids = new Set<string>();
  for (const edge of childNode?.enrolments?.edges || []) {
    const eventId = edge?.node?.occurrence?.event?.id;
    if (eventId) {
      ids.add(eventId);
    }
  }
  return ids;
};

/**
 * Extracts the set of event IDs that the active child is already enrolled in,
 * by traversing the enrolments of the matching child in the guardian's profile.
 *
 * Automatically resolves profile from `ProfileContext` and activeChildId from `EventSearchUrlContext`.
 *
 * @returns Set of event IDs the child is already enrolled in.
 */
export const useChildEnrolledEventIds = (): Set<string> => {
  const profileContext = React.useContext(ProfileContext);
  const urlContext = React.useContext(EventSearchUrlContext);

  const profile = profileContext?.profile;
  const activeChildId = urlContext?.activeChildId;

  return useMemo(
    () => extractEnrolledEventIds(profile, activeChildId),
    [profile, activeChildId]
  );
};

export default useChildEnrolledEventIds;
