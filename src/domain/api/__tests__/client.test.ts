import profileQuery from '../../profile/queries/ProfileQuery';
import client from '../client';

jest.mock('../../auth/state/AuthenticationSelectors', () => ({
  apiTokenSelector: () => 'foo',
}));

const jsonData = {
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
};

describe('graphql client', () => {
  it('sets Authorization-header to requests from currently authenticated user', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          json: () => Promise.resolve(jsonData),
          text: () => Promise.resolve(JSON.stringify(jsonData)),
        }) as Promise<Response>
    );
    try {
      await client.query({
        query: profileQuery,
      });
    } catch (e) {
      throw e;
    }
    const fetchOptions = fetchMock.mock.calls[0][1];
    expect(fetchOptions?.headers).toHaveProperty('authorization', 'Bearer foo');
  });
});
