import { matchRoutes } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ArticleArchivePage from '../../../article/ArticleArchivePage';
import ArticlePage from '../../../article/ArticlePage';
import { getAppRoutes } from '../browserRouter';

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
