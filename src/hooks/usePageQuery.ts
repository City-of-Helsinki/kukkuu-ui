import { usePageQuery as useOriginalPageQuery } from 'react-helsinki-headless-cms/apollo';

import headlessCmsClient from '../domain/headlessCms/client';
import { normalizeCmsUri } from '../utils/cmsUtils';

// Takes care of removing surrounding slashes so basically same requests are not repeated
// instead they are fetched from the cache
const usePageQuery = (uri: string, { skip }: { skip?: boolean } = {}) => {
  return useOriginalPageQuery({
    client: headlessCmsClient,
    variables: {
      id: normalizeCmsUri(uri),
    },
    skip: !!skip,
  });
};

export { usePageQuery };
