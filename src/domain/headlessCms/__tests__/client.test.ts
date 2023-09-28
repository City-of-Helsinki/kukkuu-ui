import { graphql } from 'msw';
import { PageDocument } from 'react-helsinki-headless-cms/apollo';

import { server } from '../../../test/msw/server';
import { fakePage } from '../../../utils/cmsMockDataUtils';
import client from '../client';

const page = fakePage();

beforeEach(() => {
  const link =
    process.env.REACT_APP_CMS_URI ??
    'https://kukkuu.hkih.stage.geniem.io/graphql';
  const headlessCms = graphql.link(link);
  server.use(
    headlessCms.query('page', (req, res, ctx) => {
      const response = res(
        ctx.data({
          page,
        })
      );
      return response;
    })
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
    expect(data.page.id).toEqual(page!.id);
  });
});
