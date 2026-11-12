import {
  ArticleType,
  PageType,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import {
  Page,
  PageContent,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import useGetPathname from '../../common/route/utils/useGetPathname';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import { getCmsPageTitle } from '../../utils/cmsUtils';
import { getCmsBreadcrumbs } from './breadcrumbUtils';
import styles from './headlessCmsPage.module.scss';
import NotFound from '../app/notFound/NotFound';

/**
 * Dynamic CMS page component rendered for arbitrary Headless CMS routes.
 *
 * Fetches page content dynamically using the current pathname, provides localized
 * breadcrumbs with home and page fallbacks, and renders NotFound for missing pages.
 */
const HeadlessCmsPage = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const getPathname = useGetPathname();

  return (
    <Page
      uri={location.pathname}
      className={styles.cmsPageContainer}
      navigation={undefined}
      content={
        <PageContent
          notFoundPageContent={<NotFound />}
          breadcrumbs={(page?: PageType | ArticleType) =>
            getCmsBreadcrumbs(page, {
              locale: currentLocale,
              fallbackBreadcrumbs: [
                {
                  title: t('common.breadcrumbs.home'),
                  path: getPathname('/'),
                },
                {
                  title: getCmsPageTitle(page),
                  path: null,
                },
              ],
            })
          }
        />
      }
      footer={undefined}
    />
  );
};

export default HeadlessCmsPage;
