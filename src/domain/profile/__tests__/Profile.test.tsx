import * as HdsReact from 'hds-react';
import * as ReactRouterDom from 'react-router-dom';

import { render, waitFor } from '../../../common/test/testingLibraryUtils';
import Profile from '../Profile';
import * as ProfileContext from '../hooks/useProfileContext';
import { MyProfile } from '../types/ProfileQueryTypes';
import { Language } from '../../api/generatedTypes/graphql';

const profileMock: MyProfile = {
  id: '',
  firstName: 'Test',
  lastName: 'Guy',
  email: 'test@kukkuu.fi',
  phoneNumber: '',
  language: Language.Fi,
  hasAcceptedMarketing: false,
  children: {
    __typename: undefined,
    edges: [],
  },
  languagesSpokenAtHome: {
    __typename: undefined,
    edges: [],
  },
};

const navigateMock = vi.fn();
vi.mock('react-router-dom', async (importOriginal: any) => {
  const mod = await importOriginal();
  return {
    ...mod,
  };
});

describe('Profile', () => {
  it('renders profile correctly', () => {
    vi.spyOn(HdsReact, 'useOidcClient').mockImplementation(
      () =>
        ({
          isAuthenticated: () => true,
          isRenewing: () => false,
        }) as any
    );
    vi.spyOn(ProfileContext, 'useProfileContext').mockImplementation(
      () =>
        ({
          profile: () => profileMock,
        }) as any
    );
    const { container } = render(<Profile />);
    expect(container).toMatchSnapshot();
  });

  it('redirects to the register section in home page if user is authenticated but has no profile', async () => {
    vi.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(navigateMock);
    vi.spyOn(HdsReact, 'useOidcClient').mockImplementation(
      () =>
        ({
          isAuthenticated: () => true,
          isRenewing: () => false,
        }) as any
    );
    vi.spyOn(ProfileContext, 'useProfileContext').mockImplementation(
      () =>
        ({
          profile: null,
          isLoading: false,
          isFetchCalled: true,
        }) as any
    );

    render(<Profile />);
    await waitFor(
      () => {
        expect(navigateMock).toHaveBeenCalledWith('/home#register', {
          replace: true,
        });
      },
      { timeout: 15000 }
    );
  });
});
