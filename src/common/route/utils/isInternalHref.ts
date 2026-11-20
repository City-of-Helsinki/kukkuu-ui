import AppConfig from '../../../domain/app/AppConfig';

/**
 * Returns the relative route path (pathname + search + hash) if the href points
 * to an internal application route, or null if external/non-navigable.
 *
 * @param href - The link href to evaluate.
 * @returns Relative internal route string or null.
 */
export function toInternalRoute(href?: string | null): string | null {
  if (
    href === null ||
    href === undefined ||
    href.startsWith('#') ||
    href.startsWith('//')
  ) {
    return null;
  }

  // Relative path (including empty string representing current route)
  if (href.startsWith('/') || href === '') {
    return href;
  }

  // Handle absolute URLs matching current origin or AppConfig.origin
  try {
    const url = new URL(
      href,
      globalThis.window?.location?.href ??
        globalThis.window?.location?.origin ??
        'http://localhost'
    );
    const currentOrigin = globalThis.window?.location?.origin;
    let appOrigin: string | null = null;
    try {
      appOrigin = new URL(AppConfig.origin).origin;
    } catch {
      // ignore invalid AppConfig.origin
    }

    if (
      url.origin === currentOrigin ||
      (appOrigin && url.origin === appOrigin)
    ) {
      return url.pathname + url.search + url.hash;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Checks whether an href points to an internal route within the application.
 *
 * @param href - The link href to evaluate.
 * @returns True if internal route.
 */
export function isInternalHref(href?: string | null): boolean {
  return toInternalRoute(href) !== null;
}
