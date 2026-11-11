import { faker } from '@faker-js/faker';
import merge from 'lodash/merge';
import {
  ArticleType,
  Language,
  LanguageCodeEnum,
  MenuItem,
  PageType as Page,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import type { PostsQuery } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import { Hero } from '../domain/headlessCms/graphql/__generated__';

const generateUri = () =>
  faker.word.words({ count: { min: 1, max: 4 } }).replaceAll(' ', '/');

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

export const fakeHero = (overrides?: Partial<Hero>): Hero => {
  return merge<Hero, typeof overrides>(
    {
      background_color: faker.color.rgb(),
      background_image_url: faker.internet.url(),
      description: faker.word.words(),
      link: null,
      title: faker.word.words(),
      wave_motif: null,
      __typename: 'Hero',
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
      hero: fakeHero(),
      language: fakeLanguage({ code: LanguageCodeEnum.Fi }),
      sidebar: [],
      breadcrumbs: [],
      modules: [],
      translations: [],
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
      photographerName: faker.person.fullName(),
      large: faker.internet.url(),
      medium_large: faker.internet.url(),
      medium: faker.internet.url(),
      thumbnail: faker.internet.url(),
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
      canonicalUrl: faker.internet.url(),
      twitterDescription: faker.word.words(),
      twitterTitle: faker.word.words(),
      openGraphType: faker.word.noun(),
      openGraphDescription: faker.word.words(),
      openGraphTitle: faker.word.words(),
      socialImage: fakeMediaItem(),
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

export type PostsConnection = NonNullable<PostsQuery['posts']>;

export const fakeCategory = (
  overrides?: Partial<
    NonNullable<
      NonNullable<
        NonNullable<NonNullable<ArticleType>['categories']>['edges']
      >[number]
    >['node']
  >
) => {
  return merge(
    {
      id: faker.string.uuid(),
      name: faker.word.words(),
      __typename: 'Category' as const,
    },
    overrides
  );
};

export const fakeArticle = (
  overrides?: Partial<ArticleType>
): NonNullable<ArticleType> => {
  return merge<NonNullable<ArticleType>, typeof overrides>(
    {
      id: faker.string.uuid(),
      uri: `/${generateUri()}/`,
      title: faker.word.words(),
      lead: faker.word.words(),
      slug: generateUri(),
      content: `<p>${faker.word.words()}</p>`,
      date: new Date().toISOString(),
      language: fakeLanguage({ code: LanguageCodeEnum.Fi }),
      featuredImage: null,
      breadcrumbs: [],
      sidebar: [],
      link: null,
      categories: {
        __typename: 'PostToCategoryConnection',
        edges: [],
      },
      modules: [],
      translations: [],
      seo: fakeSEO(),
      __typename: 'Post',
    },
    overrides
  );
};

export const fakePost = fakeArticle;

export const fakePostsConnection = (
  nodes: NonNullable<ArticleType>[] = [fakeArticle()],
  overrides?: Partial<PostsConnection>
): PostsConnection => {
  return merge<PostsConnection, typeof overrides>(
    {
      __typename: 'RootQueryToPostConnection',
      pageInfo: {
        __typename: 'RootQueryToPostConnectionPageInfo',
        hasNextPage: false,
        hasPreviousPage: false,
        endCursor: null,
        startCursor: null,
      },
      edges: nodes.map((node) => ({
        __typename: 'RootQueryToPostConnectionEdge',
        cursor: null,
        node,
      })),
    },
    overrides
  );
};
