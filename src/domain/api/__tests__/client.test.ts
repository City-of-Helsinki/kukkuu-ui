import profileQuery from '../../profile/queries/ProfileQuery';
import client from '../client';

vi.mock('../../auth/kukkuuApiUtils', async (importOriginal: any) => {
  const mod = await importOriginal();
  return {
    ...mod,
    getKukkuuApiTokenFromStorage: () => 'foo',
  };
});

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
    const fetchMock = vi.spyOn(global, 'fetch').mockImplementation(
      () =>
        Promise.resolve({
          json: () => Promise.resolve(jsonData),
          text: () => Promise.resolve(JSON.stringify(jsonData)),
        }) as Promise<Response>
    );
    await client.query({
      query: profileQuery,
    });
    const fetchOptions = fetchMock.mock.calls[0][1];
    expect(fetchOptions?.headers).toHaveProperty('authorization', 'Bearer foo');
  });
});
