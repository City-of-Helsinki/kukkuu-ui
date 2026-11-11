import { NetworkStatus } from '@apollo/client';
import {
  LanguageCodeFilterEnum,
  Page,
  PageType,
  SearchPageContent,
  TemplateEnum,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import {
  useCategoriesQuery,
  usePostsQuery,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import usePageByTemplateQuery from '../../hooks/usePageByTemplateQuery';
import { getCmsPageDescription, getCmsPageTitle } from '../../utils/cmsUtils';
import PageMeta from '../app/layout/utilityComponents/PageMeta';
import { useCmsBreadcrumbs } from '../headlessCms/breadcrumbUtils';
import ArticleCard from './cards/ArticleCard';
import ArticleLargeCard from './cards/ArticleLargeCard';
import styles from './articleArchivePage.module.scss';

const CATEGORIES_AMOUNT = 20;
const PAGE_SIZE = 10;

const languageToFilterEnumMap: Record<string, LanguageCodeFilterEnum> = {
  [SUPPORT_LANGUAGES.FI]: LanguageCodeFilterEnum.Fi,
  [SUPPORT_LANGUAGES.SV]: LanguageCodeFilterEnum.Sv,
  [SUPPORT_LANGUAGES.EN]: LanguageCodeFilterEnum.En,
};

const ArticleArchivePage = () => {
  const { t, i18n } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const [searchParams, setSearchParams] = useSearchParams();

  const text = searchParams.get('text') ?? '';
  const tagsParam = searchParams.get('tags');
  const selectedTagIds = tagsParam ? tagsParam.split(',').filter(Boolean) : [];
  const languageFilter =
    languageToFilterEnumMap[currentLocale] ?? LanguageCodeFilterEnum.Fi;

  const { data: pageData, loading: loadingPage } = usePageByTemplateQuery(
    TemplateEnum.PostsPage
  );
  const page = pageData?.pageByTemplate;

  const {
    data: postsData,
    fetchMore,
    loading: loadingPosts,
    networkStatus,
  } = usePostsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      first: PAGE_SIZE,
      search: text,
      language: languageFilter,
      categories: selectedTagIds,
    },
  });

  const { data: categoriesData, loading: loadingCategories } =
    useCategoriesQuery({
      variables: {
        first: CATEGORIES_AMOUNT,
        language: languageFilter,
      },
    });

  const archiveTitle =
    (page ? getCmsPageTitle(page) : '') ||
    t('cms.archiveSearch.title', 'Ajankohtaista');
  const archiveDescription =
    page !== null && page !== undefined ? getCmsPageDescription(page) : '';

  const fallbackPage = {
    title: archiveTitle,
    hero: {
      title: archiveTitle,
      description: archiveDescription,
    },
  };

  const isLoadingMore = networkStatus === NetworkStatus.fetchMore;
  const isLoading =
    loadingPage ||
    (loadingPosts && !isLoadingMore) ||
    loadingCategories;

  const pageInfo = postsData?.posts?.pageInfo;
  const hasMoreToLoad = pageInfo?.hasNextPage ?? false;

  const fetchMoreArticles = async () => {
    if (hasMoreToLoad) {
      await fetchMore({
        variables: {
          first: PAGE_SIZE,
          after: pageInfo?.endCursor,
        },
      });
    }
  };

  const articles =
    postsData?.posts?.edges
      ?.map((edge) => edge?.node)
      .filter((node): node is NonNullable<typeof node> => Boolean(node)) ?? [];

  const categories =
    categoriesData?.categories?.nodes?.filter(
      (node): node is NonNullable<typeof node> => Boolean(node)
    ) ?? [];

  const categoryOptions = [
    ...categories,
    ...selectedTagIds
      .filter(
        (id) => !categories.some((cat) => cat.databaseId.toString() === id)
      )
      .map((id) => ({
        id,
        databaseId: Number(id) || 0,
        name: id,
        __typename: 'Category' as const,
      })),
  ];

  const currentCategories = categoryOptions.filter((category) =>
    selectedTagIds.includes(category.databaseId.toString())
  );

  const breadcrumbs = useCmsBreadcrumbs(page, {
    fallbackTitle: archiveTitle,
  });

  return (
    <Page
      className={styles.articleArchiveContainer}
      navigation={undefined}
      footer={undefined}
      content={
        <>
          <PageMeta
            title={archiveTitle}
            description={archiveDescription}
            page={page}
          />
          <SearchPageContent
            breadcrumbs={breadcrumbs}
            page={page ?? (fallbackPage as unknown as PageType)}
            isLoading={isLoading || isLoadingMore}
            noResults={!isLoading && articles.length === 0}
            items={!isLoading ? articles : []}
            tags={categoryOptions}
            currentTags={currentCategories}
            currentText={text}
            withQuery
            largeFirstItem
            createLargeCard={ArticleLargeCard}
            createCard={ArticleCard}
            hasMore={hasMoreToLoad}
            onLoadMore={() => {
              fetchMoreArticles();
            }}
            onSearch={(freeSearch, tags) => {
              const nextParams = new URLSearchParams();
              if (freeSearch) {
                nextParams.set('text', freeSearch);
              }
              const tagIds = tags
                .filter((tag): tag is NonNullable<typeof tag> =>
                  Boolean(tag?.databaseId)
                )
                .map((tag) => tag.databaseId.toString())
                .join(',');
              if (tagIds) {
                nextParams.set('tags', tagIds);
              }
              setSearchParams(nextParams, { replace: true });
            }}
          />
        </>
      }
    />
  );
};

export default ArticleArchivePage;
