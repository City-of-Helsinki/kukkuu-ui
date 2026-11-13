import { useApolloClient } from '@apollo/client';
import {
  Collection,
  LanguageCodeFilterEnum,
  Page,
  PageContent,
  TemplateEnum,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import {
  CategoriesDocument,
  type CategoriesQuery,
  type CategoriesQueryVariables,
  useArticleQuery,
  useCategoriesQuery,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import useGetPathname from '../../common/route/utils/useGetPathname';
import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import {
  CmsPageSkeleton,
  SkeletonLoader,
} from '../../common/components/skeleton/CmsSkeleton';
import { useCmsLoadingState } from '../../hooks/useCmsLoadingState';
import usePageByTemplateQuery from '../../hooks/usePageByTemplateQuery';
import {
  getArticleUriFromPathname,
  getCmsPageDescription,
  getCmsPageTitle,
  hasCmsCollections,
} from '../../utils/cmsUtils';
import AppConfig from '../app/AppConfig';
import PageMeta from '../app/layout/utilityComponents/PageMeta';
import NotFound from '../app/notFound/NotFound';
import ErrorMessage from '../../common/components/error/Error';
import { useCmsBreadcrumbs } from '../headlessCms/breadcrumbUtils';
import ArticleArchivePage from './ArticleArchivePage';
import styles from './articlePage.module.scss';

const CATEGORIES_AMOUNT = 20;

const languageToFilterEnumMap: Record<string, LanguageCodeFilterEnum> = {
  [SUPPORT_LANGUAGES.FI]: LanguageCodeFilterEnum.Fi,
  [SUPPORT_LANGUAGES.SV]: LanguageCodeFilterEnum.Sv,
  [SUPPORT_LANGUAGES.EN]: LanguageCodeFilterEnum.En,
};

/**
 * Article detail page component for rendering individual CMS articles.
 *
 * Fetches article data by URI, provides middle breadcrumbs, category tag searching,
 * SEO page metadata, and handles loading and error states.
 */
const ArticlePage = () => {
  const client = useApolloClient();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const getPathname = useGetPathname();

  const articleUri = getArticleUriFromPathname(location.pathname);
  const articleQuery = useArticleQuery({
    variables: {
      id: articleUri,
    },
    skip: !articleUri,
  });
  const { isInitialLoading } = useCmsLoadingState(articleQuery);
  const { data: articleData, error: articleError } = articleQuery;

  const { data: archivePageData } = usePageByTemplateQuery(
    TemplateEnum.PostsPage
  );
  const archivePage = archivePageData?.pageByTemplate;

  const languageFilter =
    languageToFilterEnumMap[currentLocale] ?? LanguageCodeFilterEnum.Fi;
  const { data: categoriesData } = useCategoriesQuery({
    variables: {
      first: CATEGORIES_AMOUNT,
      language: languageFilter,
    },
  });
  const categories = categoriesData?.categories?.nodes ?? [];

  const article = articleData?.post;
  const archiveTitle =
    getCmsPageTitle(archivePage) ||
    t('common.breadcrumbs.articles', 'Artikkelit');
  const breadcrumbs = useCmsBreadcrumbs(article, {
    middleBreadcrumbs: [
      {
        title: archiveTitle,
        path: getPathname(AppConfig.cmsArticlesContextPath),
      },
    ],
  });

  const hasCollections = hasCmsCollections(article);

  if (!articleUri) {
    return <ArticleArchivePage />;
  }

  if (articleError && !article) {
    return (
      <ErrorMessage
        message={t(
          'article.error.failedToLoad',
          'Artikkelin lataaminen epäonnistui'
        )}
      />
    );
  }

  if (!isInitialLoading && !article) {
    return <NotFound />;
  }

  const handleArticlesSearch = async (tag: string) => {
    let category = categories.find(
      (c) => c?.id?.toString() === tag || c?.name === tag
    );

    if (!category) {
      try {
        const result = await client.query<
          CategoriesQuery,
          CategoriesQueryVariables
        >({
          query: CategoriesDocument,
          variables: {
            first: 100,
            search: tag,
            language: languageFilter,
          },
        });
        category = result.data?.categories?.nodes?.find(
          (c) => c?.id?.toString() === tag || c?.name === tag
        );
      } catch {
        // query fallback
      }
    }

    let categoryId = category?.databaseId;
    if (!categoryId) {
      if (/^\d+$/.test(tag)) {
        categoryId = Number(tag);
      } else {
        try {
          const decoded = atob(tag);
          const match = /:(\d+)$/.exec(decoded);
          if (match) {
            categoryId = Number(match[1]);
          }
        } catch {
          // not base64
        }
      }
    }

    if (categoryId) {
      navigate(
        `${getPathname(AppConfig.cmsArticlesContextPath)}?tags=${categoryId}`
      );
    }
  };

  return (
    <SkeletonLoader
      isLoading={isInitialLoading}
      skeleton={<CmsPageSkeleton data-testid="article-page-skeleton" />}
      as={null}
    >
      {() => (
        <Page
          className={styles.articlePageContainer}
          navigation={undefined}
          footer={undefined}
          content={
            <>
              <PageMeta
                title={getCmsPageTitle(article)}
                description={getCmsPageDescription(article)}
                page={article}
              />
              <PageContent
                page={article}
                breadcrumbs={breadcrumbs}
                onArticlesSearch={handleArticlesSearch}
                collections={
                  hasCollections
                    ? undefined
                    : (() =>
                        null as unknown as React.ReactElement<
                          typeof Collection
                        >[])
                }
              />
            </>
          }
        />
      )}
    </SkeletonLoader>
  );
};

export default ArticlePage;
