import faker from '@faker-js/faker';
import merge from 'lodash/merge';

import {
  Language,
  LanguageCodeEnum,
  MediaItem,
  MenuItem,
  Page,
  Post,
  Seo,
} from '../domain/headlessCms/graphql/__generated__';

const generateUri = () => faker.random.words().split(' ').join('/');

export const fakeMenuItem = (overrides?: Partial<MenuItem>): MenuItem => {
  return merge<MenuItem, typeof overrides>(
    {
      databaseId: faker.datatype.number(),
      id: faker.datatype.string(),
      path: '',
      __typename: 'MenuItem',
    },
    overrides
  );
};

export const fakePage = (
  overrides?: Partial<Page>,
  isTranslation?: boolean
): Page => {
  return merge<Page, typeof overrides>(
    {
      id: faker.datatype.uuid(),
      uri: generateUri(),
      title: faker.random.words(),
      lead: faker.random.word(),
      slug: generateUri(),
      content: faker.random.words(),
      databaseId: faker.datatype.number(),
      isFrontPage: false,
      isPostsPage: false,
      isPrivacyPage: false,
      pageId: faker.datatype.number(),
      language: fakeLanguage({ code: LanguageCodeEnum.Fi }),
      sidebar: [],
      seo: fakeSEO(),
      // to avoid infinite recursion loop :D
      translations: isTranslation
        ? null
        : [
            fakePage(
              { language: fakeLanguage({ code: LanguageCodeEnum.En }) },
              true
            ),
            fakePage(
              { language: fakeLanguage({ code: LanguageCodeEnum.Sv }) },
              true
            ),
          ],
      featuredImage: {
        node: fakeMediaItem(),
        __typename: 'NodeWithFeaturedImageToMediaItemConnectionEdge',
      },
      children: {
        edges: [],
        nodes: [],
        __typename: 'HierarchicalContentNodeToContentNodeChildrenConnection',
      },
      parent: null,
      isContentNode: false,
      isTermNode: false,
      __typename: 'Page',
    },
    overrides
  );
};

export const fakePost = (
  overrides?: Partial<Post>,
  isTranslation?: boolean
): Post => {
  return merge<Post, typeof overrides>(
    {
      id: faker.datatype.uuid(),
      postId: faker.datatype.number(),
      uri: generateUri(),
      title: faker.random.words(),
      lead: faker.random.word(),
      slug: generateUri(),
      content: faker.random.words(),
      databaseId: faker.datatype.number(),
      language: fakeLanguage({ code: LanguageCodeEnum.Fi }),
      seo: fakeSEO(),
      isContentNode: false,
      isTermNode: false,
      // to avoid infinite recursion loop :D
      translations: isTranslation
        ? null
        : [
            fakePost(
              { language: fakeLanguage({ code: LanguageCodeEnum.En }) },
              true
            ),
            fakePost(
              { language: fakeLanguage({ code: LanguageCodeEnum.Sv }) },
              true
            ),
          ],
      featuredImage: {
        node: fakeMediaItem(),
        __typename: 'NodeWithFeaturedImageToMediaItemConnectionEdge',
      },
      __typename: 'Post',
      isSticky: false,
    },
    overrides
  );
};

export const fakeMediaItem = (overrides?: Partial<MediaItem>): MediaItem => {
  return merge<MediaItem, typeof overrides>(
    {
      id: faker.datatype.uuid(),
      title: faker.random.words(),
      mediaItemId: faker.datatype.number(),
      databaseId: faker.datatype.number(),
      mediaItemUrl: faker.internet.url(),
      link: faker.internet.url(),
      altText: faker.random.words(),
      mimeType: faker.random.word(),
      uri: faker.internet.url(),
      isTermNode: false,
      isContentNode: false,
      __typename: 'MediaItem',
    },
    overrides
  );
};

export const fakeSEO = (overrides?: Partial<Seo>): Seo => {
  return merge<Seo, typeof overrides>(
    {
      canonicalUrl: faker.internet.url(),
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
