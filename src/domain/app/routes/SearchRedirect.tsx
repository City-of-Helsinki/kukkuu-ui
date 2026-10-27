import React from 'react';
import { Navigate, useSearchParams } from 'react-router';

import useGetPathname from '../../../common/route/utils/useGetPathname';

/**
 * Redirects /search to /events, preserving all query parameters.
 */
const SearchRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const getPathname = useGetPathname();

  const queryString = searchParams.toString();
  const search = queryString ? `?${queryString}` : '';

  return <Navigate to={`${getPathname('/events')}${search}`} replace />;
};

export default SearchRedirect;
