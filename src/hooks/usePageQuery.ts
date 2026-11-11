import { usePageQuery as useOriginalPageQuery } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import { normalizeCmsUri } from '../utils/cmsUtils';

// Takes care of removing surrounding slashes so basically same requests are not repeated
// instead they are fetched from the cache.
// Uses the ApolloClient configured in RHHC ConfigProvider (headlessCmsClient in app, MockedProvider in tests).
const usePageQuery = (uri: string, { skip }: { skip?: boolean } = {}) => {
  const normalizedUri = normalizeCmsUri(uri);
  return useOriginalPageQuery({
    variables: {
      id: normalizedUri,
    },
    skip: Boolean(skip || !normalizedUri),
  });
};

export { usePageQuery };
export default usePageQuery;
