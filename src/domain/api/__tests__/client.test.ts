import client from '../client';
import profileQuery from '../../profile/queries/ProfileQuery';

jest.mock('../../auth/state/AuthenticationSelectors', () => ({
  apiTokenSelector: () => 'foo',
}));

describe('graphql client', () => {
  beforeEach(() => {
    global.fetch.resetMocks();
  });

  it('sets Authorization-header to requests from currently authenticated user', async () => {
    global.fetch.mockResponse(
      JSON.stringify({
        data: {
          myProfile: {
            languagesSpokenAtHome: {
              edges: [],
            },
            children: [],
            language: '',
            phoneNumber: '',
            email: '',
            lastName: '',
            firstName: '',
            id: '1',
          },
          children: { __typename: 'ChildNodeConnection' },
        },
      })
    );

    try {
      await client.query({
        query: profileQuery,
      });
    } catch (e) {
      throw e;
    }

    const fetchOptions = global.fetch.mock.calls[0][1];
    expect(fetchOptions?.headers).toHaveProperty('authorization', 'Bearer foo');
  });
});
