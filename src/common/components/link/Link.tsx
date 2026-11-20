import React from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  useInRouterContext,
} from 'react-router';

import { toInternalRoute } from '../../route/utils/isInternalHref';

export type LinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  href?: string | null;
  to?: RouterLinkProps['to'];
  prefetch?: RouterLinkProps['prefetch'];
  ref?: React.Ref<HTMLAnchorElement>;
};

/**
 * Formats an object-form React Router `to` destination into a URL path string
 * combining `pathname`, `search`, and `hash`.
 *
 * @param to - React Router location object.
 * @returns Combined destination string.
 */
const formatToTarget = (
  to: Exclude<RouterLinkProps['to'], string>
): string => {
  const pathname = to.pathname ?? '';
  const search = to.search
    ? to.search.startsWith('?')
      ? to.search
      : `?${to.search}`
    : '';
  const hash = to.hash
    ? to.hash.startsWith('#')
      ? to.hash
      : `#${to.hash}`
    : '';
  return `${pathname}${search}${hash}`;
};

/**
 * Universal Link component that automatically resolves internal application routes
 * to React Router SPA navigation (`<Link>`), while rendering native `<a>` for external
 * URLs, `target="_blank"`, or when rendered outside a router context.
 */
export const Link: React.FC<LinkProps> = ({
  href,
  to,
  children,
  ref,
  ...rest
}) => {
  const inRouter = useInRouterContext();
  const isObjectTo = typeof to === 'object' && to !== null;
  let rawTarget = href ?? '';
  if (to !== undefined) {
    rawTarget = typeof to === 'string' ? to : formatToTarget(to);
  }
  const internalRoute = toInternalRoute(
    typeof rawTarget === 'string' ? rawTarget : ''
  );

  // If outside Router context, external link, or opening in new window/tab, fall back to native <a>
  if (!inRouter || internalRoute === null || rest.target === '_blank') {
    return (
      <a
        ref={ref}
        href={rawTarget ? String(rawTarget) : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const routerTo: RouterLinkProps['to'] = isObjectTo
    ? {
        ...to,
        pathname:
          to.pathname !== undefined
            ? (toInternalRoute(to.pathname) ?? to.pathname)
            : undefined,
      }
    : internalRoute;

  return (
    <RouterLink ref={ref} to={routerTo} {...rest}>
      {children}
    </RouterLink>
  );
};

export default Link;
