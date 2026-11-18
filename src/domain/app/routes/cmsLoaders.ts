import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { type LoaderFunctionArgs } from 'react-router';
import {
  ArticleDocument,
  PageDocument,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import defaultHeadlessCmsClient from '../../headlessCms/client';
import { getArticleUriFromPathname } from '../../../utils/cmsUtils';

/**
 * Route loader for headless CMS pages.
 *
 * Preloads the CMS page into Apollo Client cache so content is readily available
 * when the page component mounts. Catches any errors so prefetch failures never
 * break client-side navigation.
 */
export const cmsPageLoader = async (
  { request }: LoaderFunctionArgs,
  _handlerCtx?: unknown,
  client: ApolloClient<NormalizedCacheObject> = defaultHeadlessCmsClient
) => {
  try {
    const url = new URL(request.url);
    return await client.query({
      query: PageDocument,
      variables: { id: url.pathname },
      fetchPolicy: 'cache-first',
    });
  } catch {
    return null;
  }
};

/**
 * Route loader for headless CMS articles.
 *
 * Preloads the CMS article into Apollo Client cache so article content is readily available
 * when ArticlePage mounts. Catches any errors so prefetch failures never break client-side navigation.
 */
export const cmsArticleLoader = async (
  { request }: LoaderFunctionArgs,
  _handlerCtx?: unknown,
  client: ApolloClient<NormalizedCacheObject> = defaultHeadlessCmsClient
) => {
  try {
    const url = new URL(request.url);
    const articleUri = getArticleUriFromPathname(url.pathname);
    if (!articleUri) {
      return null;
    }
    return await client.query({
      query: ArticleDocument,
      variables: { id: articleUri },
      fetchPolicy: 'cache-first',
    });
  } catch {
    return null;
  }
};
