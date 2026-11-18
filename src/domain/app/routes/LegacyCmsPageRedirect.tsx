import React from 'react';
import { Navigate, useLocation } from 'react-router';

import { withCmsPagesContextPath } from '../../../utils/cmsUtils';

/**
 * Redirects legacy top-level CMS page routes (and their subpages) to `/:locale/pages/*`,
 * preserving query parameters and URL hash.
 */
const LegacyCmsPageRedirect: React.FC = () => {
  const location = useLocation();
  const cleanPathname = location.pathname.replace(/\/$/, '');
  const targetPathname = withCmsPagesContextPath(cleanPathname);

  return (
    <Navigate
      to={`${targetPathname}${location.search}${location.hash}`}
      replace
    />
  );
};

export default LegacyCmsPageRedirect;
