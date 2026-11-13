import { type LoaderFunctionArgs, matchRoutes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ArticleDocument,
  PageDocument,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import ArticleArchivePage from '../../../article/ArticleArchivePage';
import ArticlePage from '../../../article/ArticlePage';
import headlessCmsClient from '../../../headlessCms/client';
import {
  cmsArticleLoader,
  cmsPageLoader,
  getAppRoutes,
} from '../browserRouter';

describe('browserRouter loaders', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('cmsPageLoader', () => {
    it('preloads CMS page using PageDocument into Apollo Client cache', async () => {
      const mockResult = { data: { page: { id: 'page-1', title: 'Tietoa meistä' } } };
      const querySpy = vi
        .spyOn(headlessCmsClient, 'query')
        .mockResolvedValueOnce(mockResult as never);

      const request = new Request('https://kukkuu.fi/fi/pages/tietoa-meista');
      const result = await cmsPageLoader({
        request,
      } as unknown as LoaderFunctionArgs);

      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(querySpy).toHaveBeenCalledWith({
        query: PageDocument,
        variables: { id: '/fi/pages/tietoa-meista' },
        fetchPolicy: 'cache-first',
      });
      expect(result).toBe(mockResult);
    });

    it('returns null and does not throw when headlessCmsClient.query fails', async () => {
      vi.spyOn(headlessCmsClient, 'query').mockRejectedValueOnce(
        new Error('Network failure')
      );

      const request = new Request('https://kukkuu.fi/fi/pages/nonexistent');
      const result = await cmsPageLoader({
        request,
      } as unknown as LoaderFunctionArgs);

      expect(result).toBeNull();
    });

    it('returns null and does not throw when request.url is invalid', async () => {
      const result = await cmsPageLoader({
        request: { url: 'not-a-valid-url' },
      } as unknown as LoaderFunctionArgs);

      expect(result).toBeNull();
    });
  });

  describe('cmsArticleLoader', () => {
    it('preloads CMS article using ArticleDocument into Apollo Client cache', async () => {
      const mockResult = { data: { post: { id: 'post-1', title: 'Uusi artikkeli' } } };
      const querySpy = vi
        .spyOn(headlessCmsClient, 'query')
        .mockResolvedValueOnce(mockResult as never);

      const request = new Request('https://kukkuu.fi/fi/articles/uusi-artikkeli');
      const result = await cmsArticleLoader({
        request,
      } as unknown as LoaderFunctionArgs);

      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(querySpy).toHaveBeenCalledWith({
        query: ArticleDocument,
        variables: { id: '/fi/uusi-artikkeli' },
        fetchPolicy: 'cache-first',
      });
      expect(result).toBe(mockResult);
    });

    it('preloads CMS article with trailing slash correctly', async () => {
      const mockResult = { data: { post: { id: 'post-1', title: 'Uusi artikkeli' } } };
      const querySpy = vi
        .spyOn(headlessCmsClient, 'query')
        .mockResolvedValueOnce(mockResult as never);

      const request = new Request('https://kukkuu.fi/fi/articles/uusi-artikkeli/');
      const result = await cmsArticleLoader({
        request,
      } as unknown as LoaderFunctionArgs);

      expect(querySpy).toHaveBeenCalledWith({
        query: ArticleDocument,
        variables: { id: '/fi/uusi-artikkeli' },
        fetchPolicy: 'cache-first',
      });
      expect(result).toBe(mockResult);
    });

    it('returns null and does not throw when request.url is invalid', async () => {
      const result = await cmsArticleLoader({
        request: { url: 'not-a-valid-url' },
      } as unknown as LoaderFunctionArgs);

      expect(result).toBeNull();
    });

    it('returns null if route does not resolve to an article URI', async () => {
      const querySpy = vi.spyOn(headlessCmsClient, 'query');

      const request = new Request('https://kukkuu.fi/fi/articles');
      const result = await cmsArticleLoader({
        request,
      } as unknown as LoaderFunctionArgs);

      expect(result).toBeNull();
      expect(querySpy).not.toHaveBeenCalled();
    });

    it('returns null and does not throw when headlessCmsClient.query fails', async () => {
      vi.spyOn(headlessCmsClient, 'query').mockRejectedValueOnce(
        new Error('Article not found')
      );

      const request = new Request('https://kukkuu.fi/fi/articles/virheellinen');
      const result = await cmsArticleLoader({
        request,
      } as unknown as LoaderFunctionArgs);

      expect(result).toBeNull();
    });
  });

  describe('route loader assignments', () => {
    it('assigns loaders to CMS pages, articles, and catch-all routes', () => {
      const routes = getAppRoutes();
      const pageMatches = matchRoutes(routes, '/fi/pages/tietoa-meista');
      const articleMatches = matchRoutes(routes, '/fi/articles/artikkeli');
      const catchAllMatches = matchRoutes(routes, '/fi/tuntematon-cms-sivu');

      expect(pageMatches?.at(-1)?.route.loader).toBe(cmsPageLoader);
      expect(articleMatches?.at(-1)?.route.loader).toBe(cmsArticleLoader);
      expect(catchAllMatches?.at(-1)?.route.loader).toBe(cmsPageLoader);
    });
  });
});

describe('browserRouter articles route', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('resolves default /articles prefix to ArticlePage and ArticleArchivePage', () => {
    const routes = getAppRoutes();
    const archiveMatches = matchRoutes(routes, '/fi/articles');
    const articleMatches = matchRoutes(routes, '/fi/articles/test-article');

    expect(archiveMatches?.at(-1)?.route.Component).toBe(ArticleArchivePage);
    expect(articleMatches?.at(-1)?.route.Component).toBe(ArticlePage);
  });

  it('resolves configured custom prefix to ArticlePage and ArticleArchivePage', () => {
    vi.stubEnv('VITE_CMS_ARTICLES_CONTEXT_PATH', '/tarinat');

    const routes = getAppRoutes();
    const archiveMatches = matchRoutes(routes, '/fi/tarinat');
    const articleMatches = matchRoutes(routes, '/fi/tarinat/oma-tarina');

    expect(archiveMatches?.at(-1)?.route.Component).toBe(ArticleArchivePage);
    expect(articleMatches?.at(-1)?.route.Component).toBe(ArticlePage);
  });
});
