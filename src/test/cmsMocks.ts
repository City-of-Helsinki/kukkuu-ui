import { graphql, HttpResponse } from 'msw';
import { Menu } from '@city-of-helsinki/react-helsinki-headless-cms';

import { fakeLanguage } from '../utils/cmsMockDataUtils';
import { server } from './msw/server';

const route1 = '/faq/';
const title1 = 'Mikä Kukkuu?';
const mainMenu = [
  {
    title: title1,
    path: route1,
  },
  { title: 'Test 1', path: '/test1' },
  { title: 'Test 2', path: '/test2' },
  { title: 'Test 3', path: '/test3' },
  { title: 'Test 4', path: '/test4' },
];

export const initCmsMenuItemsMocks = () => {
  server.use(
    graphql.query('menu', () => {
      return HttpResponse.json({
        data: {
          menu: {
            id: 'menu',
            menuItems: {
              nodes: mainMenu.map((menuItem) => ({
                __typename: 'MenuItem',
                ...menuItem,
              })),
              __typename: 'MenuToMenuItemConnection',
            },
            __typename: 'Menu',
          } as Menu,
        },
      });
    }),
    graphql.query('languages', () => {
      return HttpResponse.json({
        data: {
          languages: [fakeLanguage()],
        },
      });
    })
  );

  return { menuItems: mainMenu };
};
