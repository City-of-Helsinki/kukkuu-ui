/* eslint-disable no-console */
import * as HdsReact from 'hds-react';
import * as ReactRouter from 'react-router';
import { screen, waitFor } from '@testing-library/react';
import { PageDocument } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import { customRender as render } from '../../../common/test/customRender';
import { fakeHero, fakePage } from '../../../utils/cmsMockDataUtils';
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
  it('renders profile correctly', async () => {
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
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Tili – Hei Test!' })
      ).toBeInTheDocument();
    });

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

    // Verify non-personal document title for page-view analytics and personalized greeting in hero
    expect(
      screen.getByRole('heading', { level: 1, name: 'Tili – Hei Test!' })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(document.title).toContain('Tili');
      expect(document.title).not.toContain('Test');
    });

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

    expect(console.info).toHaveBeenCalledWith(
      'Using a loading spinner to wait for profile to be added in the context.'
    );
    expect(console.info).toHaveBeenCalledWith(
      'User has logged in, but not created a profile. Send them to front page for registration.'
    );
  });

  it('renders CMS title, description, and breadcrumbs when available', async () => {
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

    const cmsProfilePage = fakePage({
      title: 'Kulttuurilapset-profiili CMS',
      lead: 'CMS Profiilin Kuvaus',
      hero: fakeHero({
        title: 'Kulttuurilapset-profiili CMS',
        description: 'CMS Profiilin Kuvaus',
      }),
      breadcrumbs: [
        { title: 'Etusivu CMS', uri: '/' },
        { title: 'Kulttuurilapset-profiili CMS', uri: '/profile' },
      ],
    });

    render(<Profile />, [
      {
        request: {
          query: PageDocument,
          variables: { id: 'profile' },
        },
        result: {
          data: {
            page: cmsProfilePage,
          },
        },
      },
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'Kulttuurilapset-profiili CMS',
        })
      ).toBeInTheDocument();
    });
    expect(screen.getByText('CMS Profiilin Kuvaus')).toBeInTheDocument();
    expect(screen.getAllByText('Etusivu CMS')[0]).toBeInTheDocument();
    expect(
      screen.getAllByText('Kulttuurilapset-profiili CMS')[0]
    ).toBeInTheDocument();
  });

  it('renders empty ingress without fallback when CMS profile page has empty description', async () => {
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

    const cmsProfilePage = fakePage({
      title: 'Kulttuurilapset-profiili CMS',
      lead: '',
      hero: fakeHero({
        title: 'Kulttuurilapset-profiili CMS',
        description: '',
      }),
      breadcrumbs: [
        { title: 'Etusivu CMS', uri: '/' },
        { title: 'Kulttuurilapset-profiili CMS', uri: '/profile' },
      ],
    });

    render(<Profile />, [
      {
        request: {
          query: PageDocument,
          variables: { id: 'profile' },
        },
        result: {
          data: {
            page: cmsProfilePage,
          },
        },
      },
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'Kulttuurilapset-profiili CMS',
        })
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByText(
        'Täällä näet lastesi tulevat tapahtumat ja kutsukirjeet kausittain. Voit perua ilmoittautumisen, muokata lasten ja lähiaikuisen tietoja tai rekisteröidä uuden lapsen.'
      )
    ).not.toBeInTheDocument();
  });
});
