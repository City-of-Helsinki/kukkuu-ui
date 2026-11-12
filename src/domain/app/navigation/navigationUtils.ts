import type { MenuItem } from '@city-of-helsinki/react-helsinki-headless-cms';

import { stripLocaleFromUri } from '../../../utils/cmsUtils';

/**
 * Determines whether a given navigation menu item matches the current pathname.
 *
 * Normalizes both menu item and current path by decoding URI components and stripping
 * locale prefixes. The frontpage menu item ('/') is strictly matched to the frontpage route.
 * Handles malformed percent-encoded paths by returning `false`.
 *
 * @param menuItem - The CMS navigation menu item.
 * @param currentPathname - The current browser pathname.
 * @returns `true` if the menu item should be considered active, `false` otherwise.
 */
export const getIsMenuItemActive = (
  menuItem: MenuItem,
  currentPathname: string
): boolean => {
  if (!menuItem.path || !menuItem.path.trim()) {
    return false;
  }

  try {
    const rawItemPath = decodeURIComponent(menuItem.path).replace(/\/$/, '');
    const itemPath = stripLocaleFromUri(rawItemPath).replace(/\/$/, '');
    const currentPath = stripLocaleFromUri(
      decodeURIComponent(currentPathname || '')
    ).replace(/\/$/, '');

    // Frontpage menu item should only be active on the frontpage itself
    if (itemPath === '' || itemPath === '/') {
      return currentPath === '' || currentPath === '/';
    }

    if (!itemPath) {
      return false;
    }

    return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
  } catch (error) {
    if (error instanceof URIError) {
      return false;
    }
    throw error;
  }
};
