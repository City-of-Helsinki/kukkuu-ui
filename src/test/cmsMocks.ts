import { graphql } from 'msw';

import { MenuQuery } from '../domain/headlessCms/graphql/__generated__';
import { fakePage } from '../utils/cmsMockDataUtils';
import { server } from './msw/server';

const route1 = '/faq/';
const route2 = '/faq/alisivu/';
const title1 = 'Mikä Kukkuu?';
const subTitle1 = 'Mikä Kukkuu alisivu1';
const subTitle2 = 'Mikä Kukkuu alisivu2';
const mainMenu = [
  {
    title: title1,
    uri: route1,
    children: [
      {
        title: subTitle1,
        uri: route2,
        slug: route2,
      },
      {
        title: subTitle2,
        uri: route2,
        slug: route2,
      },
    ],
  },
  { title: 'Test 1', uri: '/test1', slug: 'test1' },
  { title: 'Test 2', uri: '/test2', slug: 'test2' },
  { title: 'Test 3', uri: '/test3', slug: 'test3' },
  { title: 'Test 4', uri: '/test4', slug: 'test4' },
];

export const initCmsMenuItemsMocks = () => {
  server.use(
    graphql.query('Menu', (req, res, ctx) => {
      return res(
        ctx.data({
          menu: {
            id: 'menu',
            name: 'test',
            slug: 'test',
            menuId: 1,
            databaseId: 1,
            menuItems: {
              nodes: mainMenu.map((menuItem) => ({
                __typename: 'MenuItem',
                connectedNode: {
                  __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
                  node: fakePage({
                    uri: menuItem.uri,
                    title: menuItem.title,
                    slug: menuItem.slug,
                    children: {
                      __typename:
                        'HierarchicalContentNodeToContentNodeChildrenConnection',
                      // child node are rendered under dropdown
                      nodes: menuItem?.children?.map((childItem) =>
                        fakePage({
                          title: childItem.title,
                          uri: childItem.uri,
                          slug: childItem.slug,
                        })
                      ),
                    },
                  }),
                },
              })),
              __typename: 'MenuToMenuItemConnection',
            },
            __typename: 'Menu',
          } as MenuQuery['menu'],
        })
      );
    })
  );

  return { menuItems: mainMenu };
};
