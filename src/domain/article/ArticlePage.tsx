import { useApolloClient } from '@apollo/client';
import {
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
import { LoadingSpinner } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import useGetPathname from '../../common/route/utils/useGetPathname';
import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import usePageByTemplateQuery from '../../hooks/usePageByTemplateQuery';
import {
  getCmsPageDescription,
  getCmsPageTitle,
  stripLocaleFromUri,
} from '../../utils/cmsUtils';
import AppConfig from '../app/AppConfig';
import PageMeta from '../app/layout/utilityComponents/PageMeta';
import NotFound from '../app/notFound/NotFound';
import { useCmsBreadcrumbs } from '../headlessCms/breadcrumbUtils';
import ArticleArchivePage from './ArticleArchivePage';
import styles from './articlePage.module.scss';

const CATEGORIES_AMOUNT = 20;

const languageToFilterEnumMap: Record<string, LanguageCodeFilterEnum> = {
  [SUPPORT_LANGUAGES.FI]: LanguageCodeFilterEnum.Fi,
  [SUPPORT_LANGUAGES.SV]: LanguageCodeFilterEnum.Sv,
  [SUPPORT_LANGUAGES.EN]: LanguageCodeFilterEnum.En,
};

const getArticleUriFromPathname = (pathname: string): string => {
  const articlesPrefix = AppConfig.cmsArticlesContextPath.replace(/\/$/, '');
  const strippedLocale = stripLocaleFromUri(pathname);
  if (articlesPrefix && (strippedLocale === articlesPrefix || strippedLocale.startsWith(`${articlesPrefix}/`))) {
    const slug = strippedLocale
      .slice(articlesPrefix.length)
      .replace(/^\/+|\/+$/g, '');
    if (!slug) {
      return '';
    }
    const localeMatch = /^\/(fi|sv|en)(\/.*|$)/i.exec(pathname);
    const localePrefix = localeMatch ? `/${localeMatch[1].toLowerCase()}` : '';
    return `${localePrefix}/${slug}`;
  }
  return '';
};

const ArticlePage = () => {
  const client = useApolloClient();
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const getPathname = useGetPathname();

  const articleUri = getArticleUriFromPathname(location.pathname);
  const { data: articleData, loading: loadingArticle } = useArticleQuery({
    variables: {
      id: articleUri,
    },
    skip: !articleUri,
  });

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
  const archiveTitle = getCmsPageTitle(archivePage);
  const breadcrumbs = useCmsBreadcrumbs(article, {
    middleBreadcrumbs: archiveTitle
      ? [
          {
            title: archiveTitle,
            path: getPathname(AppConfig.cmsArticlesContextPath),
          },
        ]
      : [],
  });

  if (!articleUri) {
    return <ArticleArchivePage />;
  }

  if (loadingArticle) {
    return (
      <div className={styles.loadingSpinnerContainer}>
        <LoadingSpinner multicolor />
      </div>
    );
  }

  if (!article) {
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
          />
        </>
      }
    />
  );
};

export default ArticlePage;
