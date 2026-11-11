import { useLocation } from 'react-router';

import AppConfig from '../domain/app/AppConfig';
import { stripLocaleFromUri } from '../utils/cmsUtils';
import { usePageQuery } from './usePageQuery';

const mapCmsUriToAppUri = (uri?: string | null): string | null | undefined => {
  if (!uri) {
    return uri;
  }
  const stripped = stripLocaleFromUri(uri).replace(/\/$/, '');
  if (stripped === AppConfig.cmsSearchContextPath) {
    return uri.replace(
      new RegExp(`${AppConfig.cmsSearchContextPath}\\/?$`),
      '/events'
    );
  }
  return uri;
};

// as we dont have /cms-page/ path for cms pages, and we cannot identify,
// if its a cms page url or not, we use location.pathname as parameter
// and handle the non cms pages in Navigation component routing utils
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
