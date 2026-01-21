import { faker } from '@faker-js/faker';
import merge from 'lodash/merge';
import {
  Language,
  LanguageCodeEnum,
  MenuItem,
  PageType as Page,
} from '@city-of-helsinki/react-helsinki-headless-cms';

const generateUri = () =>
  faker.word
    .words({ count: { min: 1, max: 4 } })
    .split(' ')
    .join('/');

type MediaItem = NonNullable<NonNullable<Page>['featuredImage']>['node'];
type Seo = NonNullable<Page>['seo'];

export const fakeMenuItem = (overrides?: Partial<MenuItem>): MenuItem => {
  return merge<MenuItem, typeof overrides>(
    {
      id: faker.word.noun(),
      path: '',
      __typename: 'MenuItem',
    },
    overrides
  );
};

export const fakePage = (overrides?: Partial<Page>): Page => {
  return merge<Page, typeof overrides>(
    {
      id: faker.string.uuid(),
      uri: generateUri(),
      title: faker.word.words(),
      lead: faker.word.words(),
      slug: generateUri(),
      content: faker.word.words(),
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
    overrides
  );
};

export const fakeMediaItem = (overrides?: Partial<MediaItem>): MediaItem => {
  return merge<MediaItem, typeof overrides>(
    {
      title: faker.word.words(),
      mediaItemUrl: faker.internet.url(),
      link: faker.internet.url(),
      altText: faker.word.words(),
      mimeType: faker.system.mimeType(),
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
      title: faker.word.words(),
      twitterDescription: faker.word.words(),
      twitterTitle: faker.word.words(),
      openGraphType: faker.word.noun(),
      openGraphDescription: faker.word.words(),
      openGraphTitle: faker.word.words(),
      __typename: 'SEO',
    },
    overrides
  );
};

export const fakeLanguage = (overrides?: Partial<Language>): Language => {
  const languageCode =
    overrides?.code ??
    faker.helpers.arrayElement([
      LanguageCodeEnum.En,
      LanguageCodeEnum.Fi,
      LanguageCodeEnum.Sv,
    ]);
  return merge<Language, typeof overrides>(
    {
      id: faker.string.uuid(),
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
