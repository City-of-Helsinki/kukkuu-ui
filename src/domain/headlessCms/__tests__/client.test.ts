import { graphql } from 'msw';
import { PageDocument } from 'react-helsinki-headless-cms/apollo';

import { server } from '../../../test/msw/server';
import { fakePage } from '../../../utils/cmsMockDataUtils';
import client from '../client';

const page = fakePage();

beforeEach(() => {
  const headlessCms = graphql.link(
    'https://kukkuu.hkih.stage.geniem.io/graphql'
  );
  server.use(
    headlessCms.query('page', (req, res, ctx) => {
      return res(
        ctx.data({
          page,
        })
      );
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
    });
    expect(data.page.id).toEqual(page.id);
  });
});
