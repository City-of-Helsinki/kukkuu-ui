import { usePageQuery as useOriginalPageQuery } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import { normalizeCmsUri } from '../utils/cmsUtils';

/**
 * Hook to query a CMS page by its URI.
 *
 * Normalizes the URI by removing surrounding slashes to maximize cache hits.
 * Uses the ApolloClient configured in RHHC ConfigProvider.
 *
 * @param uri - The CMS page URI or slug.
 * @param options - Query options including `skip`.
 * @returns Query result object containing page data, loading, and error states.
 */
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
