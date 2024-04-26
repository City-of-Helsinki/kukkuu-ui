import * as HdsReact from 'hds-react';
import * as ReactRouterDom from 'react-router-dom';

import * as ProfileChildRouteAuthorization from '../../app/routes/useProfileChildRouteAuthorization';
import Unauthorized from '../Unauthorized';
import { render, waitFor } from '../../../common/test/testingLibraryUtils';

vi.mock('hds-react', async (importOriginal: any) => {
  const mod = await importOriginal();
  return {
    ...mod,
  };
});
const navigateMock = vi.fn();
vi.mock('react-router-dom', async (importOriginal: any) => {
  const mod = await importOriginal();
  return {
    ...mod,
  };
});
vi.mock(
  '../../app/routes/useProfileChildRouteAuthorization',
  async (importOriginal: any) => {
    const mod = await importOriginal();
    return {
      ...mod,
    };
  }
);

describe('Unauthorized page', () => {
  it('redirects to profile page if user is authenticated', async () => {
    vi.spyOn(HdsReact, 'useOidcClient').mockImplementation(
      () =>
        ({
          isAuthenticated: () => true,
          isRenewing: () => false,
        }) as any
    );
    render(<Unauthorized />);
    await waitFor(() => {
      expect(window.location.pathname).toBe('/profile');
    });
  });
  it('redirects to nextPath URL parameter when it is given', async () => {
    const nextPath =
      '/fi/profile/child/Q2hpbGROb2RlOjZiNzZjMWViLTg2YjktNDQ4Zi1iMzBhLTc3ZGQ2ZTkzM2Y0Yg==';

    vi.spyOn(HdsReact, 'useOidcClient').mockImplementation(
      () =>
        ({
          isAuthenticated: () => true,
          isRenewing: () => false,
        }) as any
    );
    vi.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(navigateMock);
    vi.spyOn(ReactRouterDom, 'useSearchParams').mockReturnValue([
      new URLSearchParams('next=' + nextPath),
      vi.fn(),
    ]);
    vi.spyOn(
      ProfileChildRouteAuthorization,
      'useProfileChildRouteAuthorization'
    ).mockImplementation(() => ({
      loading: false,
      isAuthorized: true,
      isAuthenticated: () => true,
    }));

    render(<Unauthorized />);
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(nextPath);
    });
  });
});
