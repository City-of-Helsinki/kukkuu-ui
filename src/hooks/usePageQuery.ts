import { usePageQuery as useOriginalPageQuery } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';

import { getCurrentLanguage } from '../common/translation/TranslationUtils';
import { localizeCmsUri } from '../utils/cmsUtils';

/**
 * Hook to query a CMS page by its URI in the active locale.
 *
 * Preserves any explicit locale prefix on the URI or prefixes the current UI
 * language when omitted (e.g. `/search` -> `/en/search`), while normalizing
 * surrounding slashes for consistent Apollo cache hits.
 *
 * @param uri - The CMS page URI or slug.
 * @param options - Query options including `skip`.
 * @returns Query result object containing page data, loading, and error states.
 */
const usePageQuery = (uri: string, { skip }: { skip?: boolean } = {}) => {
  const { i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const localizedUri = localizeCmsUri(uri, currentLocale);

  return useOriginalPageQuery({
    variables: {
      id: localizedUri,
    },
    skip: Boolean(skip || !localizedUri),
  });
};

export { usePageQuery };
export default usePageQuery;
