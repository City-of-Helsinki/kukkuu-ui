/* eslint-disable max-len */
import { MenuDocument } from 'react-helsinki-headless-cms/apollo';
import { MockedResponse } from '@apollo/client/testing';

import { languageToMenuNameMap } from '../constants';

/**
 * This is a mock of the response from the footer menu query.
 * Data taken from production CMS query response.
 */
export const footerMenuQueryResponse = {
  data: {
    menu: {
      id: 'dGVybTo1Nw==',
      menuItems: {
        nodes: [
          {
            id: 'cG9zdDo0MjY=',
            parentId: null,
            order: 1,
            target: null,
            title: null,
            path: 'https://kukku.fi/fi',
            label: 'Kulttuurin kummilapset',
            connectedNode: null,
            __typename: 'MenuItem',
          },
          {
            id: 'cG9zdDo0Mjc=',
            parentId: null,
            order: 2,
            target: null,
            title: null,
            path: 'https://hkih.production.geniem.io/saavutettavuusseloste',
            label: 'Saavutettavuusseloste',
            connectedNode: null,
            __typename: 'MenuItem',
          },
        ],
        __typename: 'MenuToMenuItemConnection',
      },
      __typename: 'Menu',
    },
  },
} as const;

export const footerMenuMock: MockedResponse = {
  request: {
    query: MenuDocument,
    variables: {
      id: languageToMenuNameMap['fi'],
      menuIdentifiersOnly: true,
    },
  },
  result: footerMenuQueryResponse,
};

export const emptyFooterMenuQueryResponse = {
  data: {
    menu: {
      id: 'empty-footer-menu',
      menuItems: {
        nodes: [],
      },
    },
  },
} as const;
