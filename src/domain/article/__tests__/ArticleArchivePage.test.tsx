import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import {
  LanguageCodeFilterEnum,
  TemplateEnum,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import {
  CategoriesDocument,
  PageByTemplateDocument,
  PostsDocument,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import { customRender as render } from '../../../common/test/customRender';
import {
  fakeArticle,
  fakeCategory,
  fakePage,
  fakePostsConnection,
} from '../../../utils/cmsMockDataUtils';
import ArticleArchivePage from '../ArticleArchivePage';

describe('<ArticleArchivePage />', () => {
  it('renders article archive page title and posts from CMS', async () => {
    window.history.pushState({}, '', '/fi/articles');

    const archivePage = fakePage({
      title: 'Artikkelit',
      lead: '<p>Lue ajankohtaiset uutiset</p>',
    });

    const firstArticle = fakeArticle({
      id: 'post-1',
      title: 'Ensimmäinen artikkeli',
      date: '2026-05-01T10:00:00',
      lead: 'Artikkelin ingressi',
      content: '<p>Artikkelin sisältö</p>',
      slug: 'ensimmainen-artikkeli',
      uri: '/fi/ensimmainen-artikkeli/',
      featuredImage: null,
      categories: {
        __typename: 'PostToCategoryConnection',
        edges: [
          {
            __typename: 'PostToCategoryConnectionEdge',
            node: fakeCategory({
              id: 'cat-1',
              name: 'Uutiset',
            }),
          },
        ],
      },
    });

    render(<ArticleArchivePage />, [
      {
        request: {
          query: PageByTemplateDocument,
          variables: { template: TemplateEnum.PostsPage, language: 'fi' },
        },
        result: {
          data: {
            pageByTemplate: archivePage,
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
            categories: [],
          },
        },
        result: {
          data: {
            posts: fakePostsConnection([firstArticle]),
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
        screen.getByRole('heading', { level: 1, name: 'Artikkelit' })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Ensimmäinen artikkeli')).toBeInTheDocument();
      expect(screen.getByText('1.5.2026')).toBeInTheDocument();
      expect(screen.getByText('Uutiset')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /Ensimmäinen artikkeli/i })
      ).toHaveAttribute('href', '/fi/articles/ensimmainen-artikkeli');
    });
  });

  it('renders archive page with fallback title when pageByTemplate is null', async () => {
    window.history.pushState({}, '', '/fi/articles/');

    const secondArticle = fakeArticle({
      id: 'post-1',
      title: 'Tutustu toimintaan!',
      date: '2026-05-01T10:00:00',
      lead: 'Artikkelin ingressi',
      content: '<p>Artikkelin sisältö</p>',
      slug: 'tutustu-toimintaan',
      uri: '/yleinen/tutustu-toimintaan/',
      featuredImage: null,
      categories: {
        __typename: 'PostToCategoryConnection',
        edges: [
          {
            __typename: 'PostToCategoryConnectionEdge',
            node: fakeCategory({
              id: 'cat-1',
              name: 'Uutiset',
            }),
          },
        ],
      },
    });

    render(<ArticleArchivePage />, [
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
            posts: fakePostsConnection([secondArticle]),
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
    await waitFor(() => {
      expect(screen.getByText('Tutustu toimintaan!')).toBeInTheDocument();
      expect(screen.getByText('1.5.2026')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /Tutustu toimintaan!/i })
      ).toHaveAttribute('href', '/fi/articles/yleinen/tutustu-toimintaan');
    });
  });

  it('includes URL-selected category beyond the first 20 in options and currentCategories', async () => {
    window.history.pushState({}, '', '/fi/articles?tags=999');

    render(<ArticleArchivePage />, [
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
              nodes: [
                {
                  id: 'cat-1',
                  databaseId: 1,
                  name: 'Kategoria 1',
                  slug: 'kategoria-1',
                  uri: '/fi/kategoriat/kategoria-1',
                  translations: [],
                  __typename: 'Category',
                },
              ],
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

    // Tag 999 should be present as an active tag pill
    await waitFor(() => {
      expect(screen.getByText('999')).toBeInTheDocument();
    });
  });
});
