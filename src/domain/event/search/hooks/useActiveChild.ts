import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';

import type { ProfileType } from '../../../profile/ProfileContext';
import type { MyProfileChild } from '../../../profile/types/ProfileQueryTypes';

export type UseActiveChildOptions = {
  profile?: ProfileType;
};

export type UseActiveChildResult = {
  /** The actively selected child node (falls back to firstChild if invalid/unspecified) */
  activeChild: MyProfileChild | undefined;
  /** Active child ID string, or undefined */
  activeChildId: string | undefined;
  /** True when a child ID was explicitly provided in the URL but not found in profile */
  isInvalidChildInUrl: boolean;
  /** First child in guardian's profile, if any */
  firstChild: MyProfileChild | undefined;
  /** All valid child nodes for the current guardian */
  childrenList: MyProfileChild[];
  /** True if guardian has one or more registered children */
  hasChildren: boolean;
};

/**
 * Resolves the currently active child for events search based on URL parameters
 * (route param :childId or search param ?child= / ?childId=) with fallback to
 * the first registered child in the guardian's profile.
 *
 * @param options.profile - Guardian's profile containing children edges.
 * @returns Object with active child data, fallback flags, and child list.
 */
export function useActiveChild({
  profile,
}: UseActiveChildOptions = {}): UseActiveChildResult {
  const { childId: routeChildId } = useParams<{ childId?: string }>();
  const [searchParams] = useSearchParams();

  const queryChildId = searchParams.get('child') || searchParams.get('childId');
  const requestedChildId = routeChildId || queryChildId || undefined;

  const childrenList = useMemo<MyProfileChild[]>(() => {
    return (profile?.children?.edges || [])
      .map((edge) => edge?.node)
      .filter((node): node is NonNullable<typeof node> => Boolean(node));
  }, [profile?.children?.edges]);

  const firstChild = childrenList[0];
  const hasChildren = childrenList.length > 0;

  let activeChild: MyProfileChild | undefined;
  let isInvalidChildInUrl = false;

  if (requestedChildId) {
    const matched = childrenList.find((c) => c.id === requestedChildId);
    if (matched) {
      activeChild = matched;
    } else if (hasChildren) {
      // Child ID was provided in URL but does not belong to guardian's profile.
      // Fall back to first child and mark as invalid so caller can notify / clean URL.
      activeChild = firstChild;
      isInvalidChildInUrl = true;
    }
  } else if (hasChildren) {
    // When no child is specified in URL, pick the first one.
    activeChild = firstChild;
  }

  return {
    activeChild,
    activeChildId: activeChild?.id,
    isInvalidChildInUrl,
    firstChild,
    childrenList,
    hasChildren,
  };
}

export default useActiveChild;
