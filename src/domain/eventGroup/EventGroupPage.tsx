import React from 'react';
import { Navigate, useParams } from 'react-router';

import useGetPathname from '../../common/route/utils/useGetPathname';

type Params = {
  childId?: string;
  eventGroupId?: string;
};

/**
 * @deprecated EventGroupPage is deprecated as event groups are no longer in use.
 * Navigating to an event-group route redirects the user to their profile page.
 */
const EventGroupPage: React.FC = () => {
  const { childId } = useParams<Params>();
  const getPathname = useGetPathname();
  const search = childId ? `?child=${encodeURIComponent(childId)}` : '';

  return <Navigate to={`${getPathname('/profile')}${search}`} replace />;
};

export default EventGroupPage;
