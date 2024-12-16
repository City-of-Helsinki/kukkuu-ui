/**
 * This is a mock of the response from the page query.
 * Data taken from production CMS query response, and simplified.
 */
const pageQueryResponse = {
  data: {
    page: {
      id: 'cG9zdDo1MDg=',
      content: '<p>Logging in has changed</p>',
      slug: 'news',
      title: 'News',
      uri: '/news/',
      link: 'https://kukkuu.content.api.hel.fi/news/',
      lead: '',
      seo: {
        title: 'News - Kukkuu',
        description: 'Logging in has changed',
        openGraphTitle: 'News',
        openGraphDescription: 'Logging in has changed',
        openGraphType: 'website',
        twitterTitle: 'News',
        twitterDescription: 'Logging in has changed',
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
          title: 'News',
          uri: '/news/',
          __typename: 'Breadcrumb',
        },
      ],
      sidebar: [],
      modules: [],
      __typename: 'Page',
    },
  },
} as const;

export default pageQueryResponse;
