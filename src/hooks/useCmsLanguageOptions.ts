import escapeRegExp from 'lodash/escapeRegExp';
import { useLocation } from 'react-router';

import AppConfig from '../domain/app/AppConfig';
import { stripLocaleFromUri } from '../utils/cmsUtils';
import { usePageQuery } from './usePageQuery';

/**
 * Maps a CMS URI to its corresponding application route.
 * Replaces the CMS search context path suffix with `/events`.
 *
 * @param uri - The CMS URI to map.
 * @returns Mapped application URI.
 */
const mapCmsUriToAppUri = (uri?: string | null): string | null | undefined => {
  if (!uri) {
    return uri;
  }
  const stripped = stripLocaleFromUri(uri).replace(/\/$/, '');
  if (stripped === AppConfig.cmsSearchContextPath) {
    const escapedSearchPath = escapeRegExp(AppConfig.cmsSearchContextPath);
    return uri.replace(
      new RegExp(`${escapedSearchPath}\\/?$`),
      '/events'
    );
  }
  return uri;
};

/**
 * Hook to retrieve localized language alternatives for the current CMS page.
 *
 * Maps CMS search URIs back to the `/events` application route and provides
 * language options for language switcher navigation.
 *
 * @param options - Configuration options, including `skip` to disable fetching.
 * @returns An array of localized language options.
 */
export const useCmsLanguageOptions = ({
  skip = false,
}: { skip?: boolean } = {}) => {
  const location = useLocation();
  const cleanPath = location.pathname.replace(/\/$/, '');
  const strippedPath = stripLocaleFromUri(cleanPath);
  const queryUri =
    strippedPath === '/events' ? AppConfig.cmsSearchContextPath : cleanPath;

  const { data: pageData } = usePageQuery(queryUri, { skip });

  return !skip
    ? [
        {
          uri: mapCmsUriToAppUri(pageData?.page?.uri),
          locale: pageData?.page?.language?.code?.toLowerCase(),
          isCurrentPage: true,
        },
        ...(pageData?.page?.translations?.map((translation) => ({
          uri: mapCmsUriToAppUri(translation?.uri),
          locale: translation?.language?.code?.toLowerCase(),
          isCurrentPage: false,
        })) ?? []),
      ]
    : [];
};
