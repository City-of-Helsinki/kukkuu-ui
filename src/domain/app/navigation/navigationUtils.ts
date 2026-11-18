import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { Header, type LanguageOption } from 'hds-react';
import { type LoaderFunctionArgs } from 'react-router';
import {
  isNonEmptyLanguage,
  languageSorter,
  MenuItem,
  ModuleItemTypeEnum,
  toPrimaryLanguageOption,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import type { ProfileType } from '../../profile/ProfileContext';
import AppConfig from '../AppConfig';
import { cmsArticleLoader, cmsPageLoader } from '../routes/cmsLoaders';
import { HARDCODED_CMS_LANGUAGES } from '../../languages/constants';
import {
  getRoutedInternalHref,
  isCmsArticlePath,
  isCmsPagePath,
  stripLocaleFromUri,
} from '../../../utils/cmsUtils';

type HeaderLinkProps = React.ComponentProps<typeof Header.Link>;

export type NavigationItem = Omit<
  MenuItem,
  'children' | 'label' | 'path'
> &
  Pick<HeaderLinkProps, 'label' | 'active' | 'onClick'> & {
    path: string;
    children?: NavigationItem[];
  };

/**
 * Pre-configured navigation language options derived from the CMS language configuration.
 */
export const DEFAULT_LANGUAGE_OPTIONS: LanguageOption[] = [
  ...HARDCODED_CMS_LANGUAGES,
]
  .filter(isNonEmptyLanguage)
  .sort(languageSorter)
  .map((language) => toPrimaryLanguageOption(language));

export type OidcProfileLike = {
  given_name?: string;
  family_name?: string;
  name?: string;
  email?: string;
} | null;

/**
 * Resolves the user's full display name and uppercase initials.
 *
 * Prioritizes the Kukkuu Guardian profile (`firstName`, `lastName`) and falls back
 * to the OIDC user profile (`given_name`, `family_name`, `name`, `email`).
 */
export const getUserDisplayInfo = (
  profile: ProfileType,
  oidcProfile?: OidcProfileLike
): { fullName: string; initials: string } => {
  const firstName =
    profile?.firstName?.trim() || oidcProfile?.given_name?.trim() || '';
  const lastName =
    profile?.lastName?.trim() || oidcProfile?.family_name?.trim() || '';

  const combinedName = [firstName, lastName].filter(Boolean).join(' ');
  const fullName =
    combinedName ||
    oidcProfile?.name?.trim() ||
    profile?.email?.trim() ||
    oidcProfile?.email?.trim() ||
    '';

  const nameParts = combinedName
    ? [firstName, lastName].filter(Boolean)
    : (oidcProfile?.name?.trim() || '').split(/\s+/).filter(Boolean);

  const initialsFromParts = nameParts
    .slice(0, 2)
    .map((part) => part.substring(0, 1))
    .join('')
    .toUpperCase();

  const fallbackEmail =
    profile?.email?.trim() || oidcProfile?.email?.trim() || '';
  const initials =
    initialsFromParts || fallbackEmail.substring(0, 1).toUpperCase();

  return { fullName, initials };
};

/**
 * Closes the HDS mobile menu drawer if currently open.
 */
export const closeMobileMenu = () => {
  if (typeof document === 'undefined') {
    return;
  }
  const menuElement = document.getElementById('Menu');
  const menuButton =
    menuElement?.tagName.toLowerCase() === 'button'
      ? (menuElement as HTMLButtonElement)
      : menuElement?.querySelector<HTMLButtonElement>('button');

  if (menuButton?.getAttribute('aria-expanded') === 'true') {
    menuButton.click();
  }
};

/**
 * Closes the HDS user dropdown menu if currently open.
 */
export const closeUserDropdown = () => {
  if (typeof document === 'undefined') {
    return;
  }
  const userDropdownElement = document.getElementById('userDropdownButton');
  const userButton =
    userDropdownElement?.tagName.toLowerCase() === 'button'
      ? (userDropdownElement as HTMLButtonElement)
      : userDropdownElement?.querySelector<HTMLButtonElement>('button');

  if (userButton?.getAttribute('aria-expanded') === 'true') {
    userButton.click();
  }
};

/**
 * Closes all open navigation menus (mobile drawer and user dropdown).
 */
export const closeNavigationMenu = () => {
  closeUserDropdown();
  closeMobileMenu();
};

/**
 * Determines whether a given navigation menu item matches the current pathname.
 *
 * Resolves the menu item's routed href using `getRoutedInternalHref`, strips locale prefixes,
 * and checks if the current URL matches the item's target path.
 *
 * @param menuItem - The CMS navigation menu item.
 * @param currentPathname - The current browser pathname.
 * @param language - Current application language.
 * @returns `true` if the menu item should be considered active, `false` otherwise.
 */
export const getIsMenuItemActive = (
  menuItem: MenuItem,
  currentPathname: string,
  language = 'fi'
): boolean => {
  if (!menuItem.path || !menuItem.path.trim()) {
    return false;
  }

  try {
    const routedHref = getRoutedInternalHref(
      menuItem.path,
      undefined,
      language
    );
    const itemPath = stripLocaleFromUri(
      decodeURIComponent(routedHref)
    ).replace(/\/$/, '');
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

/**
 * Schedules a callback during browser idle periods with fallback to setTimeout.
 */
export const scheduleIdle = (callback: () => void): (() => void) => {
  if (
    typeof window !== 'undefined' &&
    typeof window.requestIdleCallback === 'function'
  ) {
    const handle = window.requestIdleCallback(callback);
    return () => {
      if (
        typeof window !== 'undefined' &&
        typeof window.cancelIdleCallback === 'function'
      ) {
        window.cancelIdleCallback(handle);
      }
    };
  }
  const timeoutId = setTimeout(callback, 50);
  return () => clearTimeout(timeoutId);
};

export const extractMenuItems = (
  items?: (MenuItem | null | undefined)[]
): MenuItem[] => {
  if (!items) {
    return [];
  }
  const result: MenuItem[] = [];
  for (const item of items) {
    if (!item) {
      continue;
    }
    result.push(item);
    const itemWithChildren = item as {
      children?: unknown;
      childItems?: { nodes?: unknown };
    };
    if (
      'children' in itemWithChildren &&
      Array.isArray(itemWithChildren.children)
    ) {
      result.push(
        ...extractMenuItems(
          itemWithChildren.children as (MenuItem | null | undefined)[]
        )
      );
    }
    if (
      'childItems' in itemWithChildren &&
      itemWithChildren.childItems &&
      typeof itemWithChildren.childItems === 'object' &&
      'nodes' in itemWithChildren.childItems &&
      Array.isArray(itemWithChildren.childItems.nodes)
    ) {
      result.push(
        ...extractMenuItems(
          itemWithChildren.childItems.nodes as (MenuItem | null | undefined)[]
        )
      );
    }
  }
  return result;
};

/**
 * Prefetches internal CMS pages and articles referenced by menu items into Apollo Client cache.
 */
export const prefetchCmsMenuItems = (
  menuItems: (MenuItem | null | undefined)[],
  language: string,
  client?: ApolloClient<NormalizedCacheObject>
) => {
  const allItems = extractMenuItems(menuItems);
  const visited = new Set<string>();

  for (const item of allItems) {
    const node = item?.connectedNode?.node;
    const nodeUri =
      node && 'uri' in node && typeof node.uri === 'string'
        ? node.uri
        : undefined;
    const rawPath = item?.path || nodeUri;
    if (!rawPath) {
      continue;
    }

    const isArticle = node?.__typename === 'Post' || isCmsArticlePath(rawPath);

    const routedPath = getRoutedInternalHref(
      rawPath,
      isArticle ? ModuleItemTypeEnum.Article : undefined,
      language
    );

    if (
      !routedPath.startsWith('/') ||
      routedPath.startsWith('//') ||
      visited.has(routedPath)
    ) {
      continue;
    }
    visited.add(routedPath);

    const loaderArgs = {
      request: new Request(new URL(routedPath, AppConfig.origin)),
      params: {},
      context: undefined,
    } as unknown as LoaderFunctionArgs;

    if (isCmsArticlePath(routedPath)) {
      void cmsArticleLoader(loaderArgs, undefined, client);
    } else if (isCmsPagePath(routedPath)) {
      void cmsPageLoader(loaderArgs, undefined, client);
    }
  }
};
