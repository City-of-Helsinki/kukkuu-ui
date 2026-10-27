import React from 'react';
import { Navigate, useParams } from 'react-router';

import useGetPathname from '../../../common/route/utils/useGetPathname';

const ProfileChildRedirect: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const getPathname = useGetPathname();
  const search = childId ? `?child=${encodeURIComponent(childId)}` : "";
  return <Navigate to={`${getPathname("/profile")}${search}`} replace />;
};

export default ProfileChildRedirect;
