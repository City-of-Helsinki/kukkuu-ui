import { TemplateEnum } from '@city-of-helsinki/react-helsinki-headless-cms';
import {
  usePageByTemplateQuery as useOriginalPageByTemplateQuery,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';

import { getCurrentLanguage } from '../common/translation/TranslationUtils';

/**
 * Hook to query a CMS page by its template enum in the current UI language.
 *
 * @param template - The CMS template enum (e.g. FrontPage, PostsPage).
 * @param options - Query options including `skip`.
 * @returns Query result object containing data, loading, and error states.
 */
export const usePageByTemplateQuery = (
  template: TemplateEnum,
  { skip }: { skip?: boolean } = {}
) => {
  const { i18n } = useTranslation();
  const language = getCurrentLanguage(i18n);

  return useOriginalPageByTemplateQuery({
    variables: {
      template,
      language,
    },
    skip: Boolean(skip),
  });
};

export { TemplateEnum };
export default usePageByTemplateQuery;
