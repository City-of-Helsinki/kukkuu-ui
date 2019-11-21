import { gql } from 'apollo-boost';

import client from '../client';

describe('graphql client', () => {
  beforeEach(() => {
    global.fetch.resetMocks();
  });

  it('sets Authorization-header to requests from currently authenticated user', async () => {
    global.fetch.mockResponse(
      JSON.stringify({
        data: {
          children: { __typename: 'ChildNodeConnection' },
        },
      })
    );

    try {
      await client.query({
        query: gql`
          query ChildrenQuery {
            children {
              __typename
            }
          }
        `,
      });
    } catch (e) {}

    const fetchOptions = global.fetch.mock.calls[0][1];
    expect(fetchOptions.headers).toHaveProperty('Authorization', 'Bearer null');
  });
});
