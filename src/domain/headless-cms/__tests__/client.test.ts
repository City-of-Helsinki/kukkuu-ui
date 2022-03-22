import { graphql } from 'msw';

import { server } from '../../../test/msw/server';
import { fakePage } from '../../../utils/cmsMockDataUtils';
import client from '../client';
import { PageIdType } from '../graphql/__generated__';
import { PAGE_QUERY } from '../graphql/query';

const page = fakePage();

beforeEach(() => {
  const headlessCms = graphql.link(
    'https://kukkuu.hkih.stage.geniem.io/graphql'
  );
  server.use(
    headlessCms.query('Page', (req, res, ctx) => {
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
      query: PAGE_QUERY,
      variables: {
        id: 'cG9zdDox',
        idType: PageIdType.Id,
      },
    });
    expect(data.page.id).toEqual(page.id);
  });
});
