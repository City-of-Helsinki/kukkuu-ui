import { graphql } from 'msw';

import { server } from '../../../test/msw/server';
import { fakePage } from '../../../utils/cmsMockDataUtils';
import client from '../client';
import { PAGE_QUERY } from '../graphql/query';
import { PageIdType } from '../graphql/__generated__';

const page = fakePage();

beforeEach(() => {
  const headlessCms = graphql.link(
    'https://kukkuu.hkih.stage.geniem.io/graphql'
  );
  server.use(
    headlessCms.query('Page', (req, res, ctx) => {
      const { id: pageId } = req.variables;
      console.log('pageId', pageId);
      return res(
        ctx.data({
          page,
        })
      );
    })
  );
});

describe('Headless CMS Client', () => {
  // TODO: skipping: does not work - dunno why!
  it('returns a page when a page query is requested', async () => {
    const { data } = await client.query({
      query: PAGE_QUERY,
      variables: {
        id: 'cG9zdDox',
        idType: PageIdType.Id,
      },
    });
    expect(data.page).toBe(page);
  });
});
