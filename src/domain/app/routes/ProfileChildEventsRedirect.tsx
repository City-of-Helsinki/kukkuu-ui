import React from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router';

import useGetPathname from '../../../common/route/utils/useGetPathname';

/**
 * Redirects legacy child events URLs (/profile/child/:childId/events)
 * to the new top-level events search page (/events?child=:childId),
 * preserving any additional search parameters such as pagination.
 */
const ProfileChildEventsRedirect: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const [searchParams] = useSearchParams();
  const getPathname = useGetPathname();

  const nextParams = new URLSearchParams(searchParams);
  if (childId) {
    nextParams.set('child', childId);
  }

  const queryString = nextParams.toString();
  const search = queryString ? `?${queryString}` : '';

  return <Navigate to={`${getPathname('/events')}${search}`} replace />;
};

export default ProfileChildEventsRedirect;
