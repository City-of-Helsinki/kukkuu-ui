import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';

/**
 * @deprecated Back button navigation for event routes is deprecated.
 * Event pages now use breadcrumb navigation directly to the child's events search page.
 */
export const useEventRouteGoBackTo = () => {
  const { i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const { childId } = useParams<{
    childId: string;
    eventId: string;
  }>();

  return `/${currentLocale}/profile/child/${childId}`;
};
