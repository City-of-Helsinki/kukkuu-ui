import { MenuDocument } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { MockedResponse } from '@apollo/client/testing';

import { languageToMenuNameMap } from '../constants';

/**
 * This is a mock of the response from the header menu query.
 * Data taken from production CMS query response, and strongly
 * reduced in size for simplicity.
 */
export const headerMenuQueryResponse = {
  data: {
    menu: {
      id: 'dGVybToxNg==',
      menuItems: {
        nodes: [
          {
            id: 'cG9zdDo1MTU=',
            parentId: null,
            order: 1,
            target: null,
            title: null,
            path: '/ajankohtaista/',
            label: 'Ajankohtaista',
            connectedNode: {
              node: {
                id: 'cG9zdDo1MDU=',
                content: '<p>Kirjautuminen palveluun on muuttunut</p>',
                slug: 'ajankohtaista',
                title: 'Ajankohtaista',
                uri: '/ajankohtaista/',
                link: 'https://kukkuu.content.api.hel.fi/ajankohtaista/',
                lead: '',
                seo: {
                  title: 'Ajankohtaista &#x2d; Kukkuu',
                  description: 'Kirjautuminen palveluun on muuttunut',
                  openGraphTitle: 'Ajankohtaista',
                  openGraphDescription: 'Kirjautuminen palveluun on muuttunut',
                  openGraphType: 'website',
                  twitterTitle: 'Ajankohtaista',
                  twitterDescription: 'Kirjautuminen palveluun on muuttunut',
                  canonicalUrl: '',
                  socialImage: null,
                  __typename: 'SEO',
                },
                hero: {
                  background_color: '',
                  background_image_url: '',
                  description: '',
                  link: {
                    target: null,
                    title: null,
                    url: null,
                    __typename: 'Link',
                  },
                  title: '',
                  wave_motif: '',
                  __typename: 'Hero',
                },
                language: {
                  code: 'FI',
                  id: 'TGFuZ3VhZ2U6Zmk=',
                  locale: 'fi',
                  name: 'Suomi',
                  slug: 'fi',
                  __typename: 'Language',
                },
                translations: [],
                featuredImage: null,
                breadcrumbs: [
                  {
                    title: 'Etusivu',
                    uri: '/',
                    __typename: 'Breadcrumb',
                  },
                  {
                    title: 'Ajankohtaista',
                    uri: '/ajankohtaista/',
                    __typename: 'Breadcrumb',
                  },
                ],
                sidebar: [],
                modules: [],
                __typename: 'Page',
                children: {
                  nodes: [],
                  __typename:
                    'HierarchicalContentNodeToContentNodeChildrenConnection',
                },
              },
              __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            },
            __typename: 'MenuItem',
          },
        ],
        __typename: 'MenuToMenuItemConnection',
      },
      __typename: 'Menu',
    },
  },
} as const;

export const headerMenuMock: MockedResponse = {
  request: {
    query: MenuDocument,
    variables: {
      id: languageToMenuNameMap['fi'],
      menuIdentifiersOnly: false,
    },
  },
  result: headerMenuQueryResponse,
};

export const emptyHeaderMenuQueryResponse = {
  data: {
    menu: {
      id: 'empty-header-menu',
      menuItems: {
        nodes: [],
      },
    },
  },
} as const;
