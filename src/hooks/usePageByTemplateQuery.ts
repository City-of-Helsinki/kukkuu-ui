import { TemplateEnum } from '@city-of-helsinki/react-helsinki-headless-cms';
import {
  usePageByTemplateQuery as useOriginalPageByTemplateQuery,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';

import { getCurrentLanguage } from '../common/translation/TranslationUtils';

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
