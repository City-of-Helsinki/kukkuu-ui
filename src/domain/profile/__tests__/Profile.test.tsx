/* eslint-disable no-console */
import * as HdsReact from 'hds-react';
import * as ReactRouter from 'react-router';
import { screen, waitFor } from '@testing-library/react';

import { customRender as render } from '../../../common/test/customRender';
import Profile from '../Profile';
import * as ProfileContext from '../hooks/useProfileContext';
import { MyProfile } from '../types/ProfileQueryTypes';
import { Language } from '../../api/generatedTypes/graphql';

const profileMock: MyProfile = {
  id: 'profile-1',
  firstName: 'Test',
  lastName: 'Guy',
  email: 'test@kukkuu.fi',
  phoneNumber: '+358401234567',
  language: Language.Fi,
  hasAcceptedCommunication: false,
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
vi.mock('react-router', async (importOriginal: any) => {
  const mod = await importOriginal();
  return {
    ...mod,
  };
});

// Mock the console.info calls to avoid them in the test output
// but also check that they are called correctly in the tests
beforeEach(() => {
  vi.spyOn(console, 'info').mockImplementation(() => {});
});

afterEach(() => {
  (console.info as ReturnType<typeof vi.fn>).mockRestore();
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
          profile: profileMock,
          isLoading: false,
          isFetchCalled: true,
        }) as any
    );
    const { container } = render(<Profile />);

    // Breadcrumbs
    expect(screen.getByRole('link', { name: 'Etusivu' })).toBeInTheDocument();
    expect(screen.getByText('Tili')).toBeInTheDocument();

    // Hero section
    expect(
      screen.getByRole('heading', { level: 1, name: 'Tili – Hei Test!' })
    ).toBeInTheDocument();

    // Children section
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Kulttuurilapset ja tapahtumat',
      })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', {
        name: /Rekisteröi uusi lapsi/i,
      })
    ).toHaveLength(2);

    // Guardian section
    expect(
      screen.getByRole('heading', { level: 2, name: 'Lähiaikuinen' })
    ).toBeInTheDocument();
    expect(screen.getByText('Test Guy')).toBeInTheDocument();
    expect(screen.getByText('p. +358401234567')).toBeInTheDocument();
    expect(screen.getByText('test@kukkuu.fi')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
    expect(console.info).not.toHaveBeenCalled();
  });

  it('redirects to the register section in home page if user is authenticated but has no profile', async () => {
    vi.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateMock);
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

    expect(console.info).toHaveBeenCalledTimes(2);
    expect(console.info).toHaveBeenNthCalledWith(
      1,
      'Using a loading spinner to wait for profile to be added in the context.'
    );
    expect(console.info).toHaveBeenNthCalledWith(
      2,
      'User has logged in, but not created a profile. Send them to front page for registration.'
    );
  });
});
