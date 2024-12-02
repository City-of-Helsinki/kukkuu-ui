import { graphql, HttpResponse } from 'msw';
import { PageDocument } from 'react-helsinki-headless-cms/apollo';

import { server } from '../../../test/msw/server';
import { fakePage } from '../../../utils/cmsMockDataUtils';
import client from '../client';

const page = fakePage();

beforeEach(() => {
  const link =
    process.env.VITE_CMS_URI ||
    'https://kukkuu.app-staging.hkih.hion.dev/graphql';
  const headlessCms = graphql.link(link);
  server.use(
    headlessCms.query('page', () => HttpResponse.json({ data: { page } }))
  );
});

describe('Headless CMS Client', () => {
  it('returns a page when a page query is requested', async () => {
    const { data } = await client.query({
      query: PageDocument,
      variables: {
        id: '/en/slug',
        language: 'EN',
      },
      // NOTE: The React-helsinki-headless-cms library sets a cache here by default
      fetchPolicy: 'no-cache',
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(data.page.id).toEqual(page!.id);
  });
});
