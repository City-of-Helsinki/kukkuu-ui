import React from 'react';
import { Navigate, useParams } from 'react-router';

import useGetPathname from '../../../common/route/utils/useGetPathname';

type LegacyEventRedirectProps = {
  hash?: string;
};

/**
 * @deprecated Legacy redirect component for obsolete `/redirect`, `/external-enrolment`
 * and occurrence `/enrol` routes. Redirects to the unified event details page.
 */
const LegacyEventRedirect: React.FC<LegacyEventRedirectProps> = ({
  hash = '#ticket-system-section',
}) => {
  const { childId, eventId } = useParams<{
    childId?: string;
    eventId?: string;
  }>();
  const getPathname = useGetPathname();

  if (!childId || !eventId) {
    return <Navigate to={getPathname('/')} replace />;
  }

  const targetPath = getPathname(`/profile/child/${childId}/event/${eventId}`);

  return <Navigate to={`${targetPath}${hash}`} replace />;
};

export default LegacyEventRedirect;
