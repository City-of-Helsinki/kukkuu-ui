import React from 'react';

import { RESET_FOCUS_ID } from './constants';

/**
 * Ensure that browser focus is set to body when navigating using
 * <Link> from react-router.
 */
const ResetFocus = (): React.ReactElement => {
  const pathname = window?.location?.pathname;
  const node = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const isClient = typeof window !== 'undefined';
    if (isClient) {
      node.current?.focus();
    }
  }, [pathname]);

  return <div ref={node} tabIndex={-1} id={RESET_FOCUS_ID} />;
};

export default ResetFocus;
