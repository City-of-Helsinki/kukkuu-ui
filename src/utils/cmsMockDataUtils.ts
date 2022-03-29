import faker from '@faker-js/faker';
import merge from 'lodash/merge';
import {
  Language,
  LanguageCodeEnum,
  MenuItem,
  PageType as Page,
} from 'react-helsinki-headless-cms';

const generateUri = () => faker.random.words().split(' ').join('/');

type MediaItem = Page['translation']['featuredImage']['node'];
type Seo = Page['translation']['seo'];

export const fakeMenuItem = (overrides?: Partial<MenuItem>): MenuItem => {
  return merge<MenuItem, typeof overrides>(
    {
      id: faker.datatype.string(),
      path: '',
      __typename: 'MenuItem',
    },
    overrides
  );
};

export const fakePage = (overrides?: Partial<Page>): Page => {
  return merge<Page, typeof overrides>(
    {
      id: faker.datatype.uuid(),
      translation: {
        id: faker.datatype.uuid(),
        uri: generateUri(),
        title: faker.random.words(),
        lead: faker.random.word(),
        slug: generateUri(),
        content: faker.random.words(),
        language: fakeLanguage({ code: LanguageCodeEnum.Fi }),
        sidebar: [],
        seo: fakeSEO(),
        link: generateUri(),
        featuredImage: {
          node: fakeMediaItem(),
          __typename: 'NodeWithFeaturedImageToMediaItemConnectionEdge',
        },
        __typename: 'Page',
      },
    },
    overrides
  );
};

export const fakeMediaItem = (overrides?: Partial<MediaItem>): MediaItem => {
  return merge<MediaItem, typeof overrides>(
    {
      title: faker.random.words(),
      mediaItemUrl: faker.internet.url(),
      link: faker.internet.url(),
      altText: faker.random.words(),
      mimeType: faker.random.word(),
      uri: faker.internet.url(),
      __typename: 'MediaItem',
    },
    overrides
  );
};

export const fakeSEO = (overrides?: Partial<Seo>): Seo => {
  return merge<Seo, typeof overrides>(
    {
      description: faker.lorem.text(),
      title: faker.random.words(),
      twitterDescription: faker.random.words(),
      twitterTitle: faker.random.words(),
      openGraphType: faker.random.word(),
      openGraphDescription: faker.random.words(),
      openGraphTitle: faker.random.words(),
      __typename: 'SEO',
    },
    overrides
  );
};

export const fakeLanguage = (overrides?: Partial<Language>): Language => {
  const languageCode =
    overrides?.code ??
    faker.random.arrayElement([
      LanguageCodeEnum.En,
      LanguageCodeEnum.Fi,
      LanguageCodeEnum.Sv,
    ]);
  return merge<Language, typeof overrides>(
    {
      id: faker.datatype.uuid(),
      code: languageCode,
      locale: languageCode.toLowerCase(),
      slug: languageCode.toLowerCase(),
      name: {
        [LanguageCodeEnum.En as string]: 'Englanti',
        [LanguageCodeEnum.Fi]: 'Suomi',
        [LanguageCodeEnum.Sv]: 'Ruotsi',
      }[languageCode],
    },
    overrides
  );
};
