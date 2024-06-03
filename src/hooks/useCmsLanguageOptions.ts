import { useLocation } from 'react-router';

import { usePageQuery } from './usePageQuery';

// as we dont have /cms-page/ path for cms pages, and we cannot identify,
// if its a cms page url or not, we use location.pathname as parameter
// and handle the non cms pages in Navigation component routing utils
export const useCmsLanguageOptions = ({
  skip = false,
}: { skip?: boolean } = {}) => {
  const location = useLocation();
  const { data: pageData } = usePageQuery(location.pathname, { skip });

  return !skip
    ? [
        {
          uri: pageData?.page?.uri,
          locale: pageData?.page?.language?.code?.toLowerCase(),
        },
        ...(pageData?.page?.translations?.map((translation) => ({
          uri: translation?.uri,
          locale: translation?.language?.code?.toLowerCase(),
        })) ?? []),
      ]
    : [];
};
