import type { MenuItem } from '@city-of-helsinki/react-helsinki-headless-cms';

import { stripLocaleFromUri } from '../../../utils/cmsUtils';

export const getIsMenuItemActive = (
  menuItem: MenuItem,
  currentPathname: string
): boolean => {
  if (!menuItem.path || !menuItem.path.trim()) {
    return false;
  }

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
};
