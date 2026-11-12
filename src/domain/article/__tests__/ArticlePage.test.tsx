import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import {
  LanguageCodeFilterEnum,
  TemplateEnum,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import {
  ArticleDocument,
  CategoriesDocument,
  PageByTemplateDocument,
  PostsDocument,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import { customRender as render } from '../../../common/test/customRender';
import { fakeArticle, fakePostsConnection } from '../../../utils/cmsMockDataUtils';
import ArticlePage from '../ArticlePage';

describe('<ArticlePage />', () => {
  it('fetches and renders single CMS article by stripped article slug', async () => {
    window.history.pushState({}, '', '/fi/articles/ensimmainen-artikkeli');

    const article = fakeArticle({
      id: 'post-1',
      title: 'Ensimmäinen artikkeli',
      date: '2026-05-01T10:00:00',
      lead: 'Artikkelin ingressi',
      content: '<p>Artikkelin leipäteksti</p>',
      slug: 'ensimmainen-artikkeli',
      uri: '/fi/ensimmainen-artikkeli/',
      breadcrumbs: [
        {
          title: 'Etusivu',
          uri: '/fi/',
          __typename: 'Breadcrumb',
        },
        {
          title: 'Ensimmäinen artikkeli',
          uri: '/fi/ensimmainen-artikkeli/',
          __typename: 'Breadcrumb',
        },
      ],
    });

    render(<ArticlePage />, [
      {
        request: {
          query: ArticleDocument,
          variables: { id: '/fi/ensimmainen-artikkeli' },
        },
        result: {
          data: {
            post: article,
          },
        },
      },
      {
        request: {
          query: CategoriesDocument,
          variables: {
            first: 20,
            language: LanguageCodeFilterEnum.Fi,
          },
        },
        result: {
          data: {
            categories: {
              __typename: 'RootQueryToCategoryConnection',
              nodes: [],
            },
          },
        },
      },
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Ensimmäinen artikkeli' })
      ).toBeInTheDocument();
    });
    expect(screen.getByText('Artikkelin leipäteksti')).toBeInTheDocument();
    await waitFor(() => {
      expect(document.title).toContain(article.seo?.title);
    });
  });

  it('falls back to article title and lead in PageMeta when SEO fields are empty', async () => {
    window.history.pushState({}, '', '/fi/articles/ilman-seo-tietoja');

    const article = fakeArticle({
      id: 'post-no-seo',
      title: 'Artikkeli ilman SEO-tietoja',
      lead: 'Ingressi ilman SEO-tietoja',
      content: '<p>Tekstiä</p>',
      slug: 'ilman-seo-tietoja',
      uri: '/fi/ilman-seo-tietoja/',
      seo: {
        __typename: 'SEO',
        title: '',
        description: '',
      },
    });

    render(<ArticlePage />, [
      {
        request: {
          query: ArticleDocument,
          variables: { id: '/fi/ilman-seo-tietoja' },
        },
        result: {
          data: {
            post: article,
          },
        },
      },
      {
        request: {
          query: CategoriesDocument,
          variables: {
            first: 20,
            language: LanguageCodeFilterEnum.Fi,
          },
        },
        result: {
          data: {
            categories: {
              __typename: 'RootQueryToCategoryConnection',
              nodes: [],
            },
          },
        },
      },
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'Artikkeli ilman SEO-tietoja',
        })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(document.title).toContain('Artikkeli ilman SEO-tietoja');
    });
  });

  it('renders ArticleArchivePage when accessing articles without a slug', async () => {
    window.history.pushState({}, '', '/fi/articles/');

    render(<ArticlePage />, [
      {
        request: {
          query: PostsDocument,
          variables: {
            first: 10,
            search: '',
            language: LanguageCodeFilterEnum.Fi,
            categories: [],
          },
        },
        result: {
          data: {
            posts: fakePostsConnection([]),
          },
        },
      },
      {
        request: {
          query: CategoriesDocument,
          variables: {
            first: 20,
            language: LanguageCodeFilterEnum.Fi,
          },
        },
        result: {
          data: {
            categories: {
              __typename: 'RootQueryToCategoryConnection',
              nodes: [],
            },
          },
        },
      },
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Ajankohtaista' })
      ).toBeInTheDocument();
    });
  });

  it('resolves categories beyond the first 20 when clicking an article tag', async () => {
    window.history.pushState({}, '', '/fi/articles/artikkeli-tagilla');

    const article = fakeArticle({
      id: 'post-tag-1',
      title: 'Artikkeli tagilla',
      slug: 'artikkeli-tagilla',
      uri: '/fi/artikkeli-tagilla/',
      categories: {
        __typename: 'PostToCategoryConnection',
        edges: [
          {
            __typename: 'PostToCategoryConnectionEdge',
            node: {
              id: 'cat-extra-id',
              name: 'Harvinainen kategoria',
              __typename: 'Category',
            },
          },
        ],
      },
    });

    render(<ArticlePage />, [
      {
        request: {
          query: ArticleDocument,
          variables: { id: '/fi/artikkeli-tagilla' },
        },
        result: {
          data: {
            post: article,
          },
        },
      },
      {
        request: {
          query: CategoriesDocument,
          variables: {
            first: 20,
            language: LanguageCodeFilterEnum.Fi,
          },
        },
        result: {
          data: {
            categories: {
              __typename: 'RootQueryToCategoryConnection',
              nodes: [],
            },
          },
        },
      },
      {
        request: {
          query: CategoriesDocument,
          variables: {
            first: 100,
            search: 'cat-extra-id',
            language: LanguageCodeFilterEnum.Fi,
          },
        },
        result: {
          data: {
            categories: {
              __typename: 'RootQueryToCategoryConnection',
              nodes: [
                {
                  id: 'cat-extra-id',
                  databaseId: 999,
                  name: 'Harvinainen kategoria',
                  slug: 'harvinainen-kategoria',
                  uri: '/fi/kategoriat/harvinainen-kategoria',
                  translations: [],
                  __typename: 'Category',
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: PostsDocument,
          variables: {
            first: 10,
            search: '',
            language: LanguageCodeFilterEnum.Fi,
            categories: ['999'],
          },
        },
        result: {
          data: {
            posts: fakePostsConnection([]),
          },
        },
      },
    ]);

    await waitFor(() => {
      expect(screen.getByText('Harvinainen kategoria')).toBeInTheDocument();
    });

    const tagButton = screen.getByRole('button', {
      name: 'Harvinainen kategoria',
    });
    tagButton.click();

    await waitFor(() => {
      expect(window.location.search).toContain('tags=999');
    });
  });

  it('renders error message when article query fails instead of not found', async () => {
    window.history.pushState({}, '', '/fi/articles/virheellinen-artikkeli');

    render(<ArticlePage />, [
      {
        request: {
          query: ArticleDocument,
          variables: { id: '/fi/virheellinen-artikkeli' },
        },
        error: new Error('Network error loading article'),
      },
      {
        request: {
          query: PageByTemplateDocument,
          variables: { template: TemplateEnum.PostsPage, language: 'fi' },
        },
        result: {
          data: {
            pageByTemplate: null,
          },
        },
      },
      {
        request: {
          query: CategoriesDocument,
          variables: {
            first: 20,
            language: LanguageCodeFilterEnum.Fi,
          },
        },
        result: {
          data: {
            categories: {
              __typename: 'RootQueryToCategoryConnection',
              nodes: [],
            },
          },
        },
      },
    ]);

    await waitFor(() => {
      expect(
        screen.getByText('Artikkelin lataaminen epäonnistui')
      ).toBeInTheDocument();
    });
    expect(screen.queryByText(/404/i)).not.toBeInTheDocument();
  });
});
