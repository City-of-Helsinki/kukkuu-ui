import { describe, expect, it, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as HdsReact from 'hds-react';
import * as ReactRouter from 'react-router';
import type { MenuItem } from '@city-of-helsinki/react-helsinki-headless-cms';
import {
  ArticleDocument,
  PageDocument,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import Navigation from '../Navigation';
import UserNavigation from '../UserNavigation';
import {
  closeMobileMenu,
  closeNavigationMenu,
  closeUserDropdown,
  extractMenuItems,
  getIsMenuItemActive,
  getUserDisplayInfo,
  prefetchCmsMenuItems,
  scheduleIdle,
} from '../navigationUtils';
import headlessCmsClient from '../../../headlessCms/client';
import AppConfig from '../../AppConfig';
import * as ProfileContext from '../../../profile/hooks/useProfileContext';
import * as UseLogoutModule from '../../../auth/useLogout';
import { Language } from '../../../api/generatedTypes/graphql';
import type { MyProfile } from '../../../profile/types/ProfileQueryTypes';
import { headerMenuMock } from '../__mocks__/headerMenuMock';
import { languagesMock } from '../../footer/__mocks__/languagesMock';
import { customRender } from '../../../../common/test/customRender';

vi.mock('react-router', async (importOriginal: () => Promise<object>) => {
  const mod = await importOriginal();
  return {
    ...mod,
  };
});

describe('getIsMenuItemActive', () => {
  const createMenuItem = (path?: string | null): MenuItem =>
    ({
      id: 'test-item',
      path,
      label: 'Test Item',
    }) as MenuItem;

  describe('frontpage menu item', () => {
    it.each([
      ['/', '/'],
      ['/', '/fi'],
      ['/', '/fi/'],
      ['/', '/sv'],
      ['/', '/en'],
      ['/fi', '/'],
      ['/fi', '/fi'],
      ['/fi/', '/fi'],
      ['/sv', '/sv'],
      ['/en', '/en'],
    ])('returns true for frontpage item "%s" on root path "%s"', (itemPath, currentPath) => {
      expect(getIsMenuItemActive(createMenuItem(itemPath), currentPath)).toBe(true);
    });

    it.each([
      ['/', '/events'],
      ['/', '/fi/events'],
      ['/', '/fi/profile'],
      ['/', '/fi/pages/about'],
      ['/fi', '/fi/articles'],
    ])('returns false for frontpage item "%s" on non-root path "%s"', (itemPath, currentPath) => {
      expect(getIsMenuItemActive(createMenuItem(itemPath), currentPath)).toBe(false);
    });
  });

  describe('semi-static pages (/events, /profile)', () => {
    it('returns true when current path exactly matches semi-static menu item', () => {
      expect(getIsMenuItemActive(createMenuItem('/events'), '/events')).toBe(true);
      expect(getIsMenuItemActive(createMenuItem('/events'), '/fi/events')).toBe(true);
      expect(getIsMenuItemActive(createMenuItem('/fi/events'), '/fi/events/')).toBe(true);
      expect(getIsMenuItemActive(createMenuItem('/profile'), '/fi/profile')).toBe(true);
    });

    it('returns true when current path is a sub-route of semi-static menu item', () => {
      expect(getIsMenuItemActive(createMenuItem('/events'), '/fi/events/child-123')).toBe(true);
      expect(
        getIsMenuItemActive(createMenuItem('/profile'), '/fi/profile/child/123/events')
      ).toBe(true);
      expect(
        getIsMenuItemActive(createMenuItem('/profile'), '/fi/profile/subscriptions')
      ).toBe(true);
    });

    it('returns false for partial non-subpath matches or unrelated paths', () => {
      expect(getIsMenuItemActive(createMenuItem('/events'), '/fi/events-archive')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem('/events'), '/fi/profile')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem('/profile'), '/fi/events')).toBe(false);
    });
  });

  describe('fully dynamic CMS pages (/pages/*, /articles/*)', () => {
    it('returns true for exact CMS page matches with or without locale', () => {
      expect(
        getIsMenuItemActive(createMenuItem('/pages/about'), '/fi/pages/about')
      ).toBe(true);
      expect(
        getIsMenuItemActive(createMenuItem('/fi/pages/about'), '/fi/pages/about')
      ).toBe(true);
      expect(
        getIsMenuItemActive(createMenuItem('/articles'), '/fi/articles')
      ).toBe(true);
    });

    it('returns true when current path is a child page of CMS menu item', () => {
      expect(
        getIsMenuItemActive(
          createMenuItem('/pages/about'),
          '/fi/pages/about/team'
        )
      ).toBe(true);
      expect(
        getIsMenuItemActive(
          createMenuItem('/articles'),
          '/fi/articles/latest-news'
        )
      ).toBe(true);
    });

    it('returns false when current path does not match CMS menu item', () => {
      expect(
        getIsMenuItemActive(createMenuItem('/pages/about'), '/fi/pages/contact')
      ).toBe(false);
      expect(
        getIsMenuItemActive(
          createMenuItem('/pages/about'),
          '/fi/pages/about-extra'
        )
      ).toBe(false);
      expect(
        getIsMenuItemActive(createMenuItem('/articles'), '/fi/pages/articles')
      ).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('returns false if menuItem path is null or undefined or empty string', () => {
      expect(getIsMenuItemActive(createMenuItem(null), '/fi/events')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem(undefined), '/fi/events')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem(''), '/fi/events')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem(null), '/')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem(undefined), '/fi')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem(''), '/fi/')).toBe(false);
      expect(getIsMenuItemActive(createMenuItem('   '), '/')).toBe(false);
    });

    it('handles encoded characters properly', () => {
      expect(
        getIsMenuItemActive(
          createMenuItem('/pages/kysymyksi%C3%A4'),
          '/fi/pages/kysymyksiä'
        )
      ).toBe(true);
    });

    it('returns false without throwing when encountering malformed percent-encoded paths', () => {
      expect(
        getIsMenuItemActive(createMenuItem('/pages/%E0%A4%A'), '/fi/pages/test')
      ).toBe(false);
      expect(
        getIsMenuItemActive(createMenuItem('/pages/test'), '/fi/pages/%E0%A4%A')
      ).toBe(false);
    });
  });
});

describe('<Navigation />', () => {
  it('renders skeleton pills and sets aria-busy="true" while header menu is loading', async () => {
    const delayedHeaderMock = {
      ...headerMenuMock,
      delay: 500,
    };

    const { container } = customRender(<Navigation />, [
      delayedHeaderMock,
      languagesMock,
    ]);

    const busyWrapper = container.querySelector('[aria-busy="true"]');
    expect(busyWrapper).toBeInTheDocument();
    expect(screen.getByTestId('nav-menu-skeleton')).toBeInTheDocument();
    expect(screen.getAllByTestId('nav-pill-skeleton')).toHaveLength(3);

    await waitFor(() => {
      expect(screen.getByText('Ajankohtaista')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('nav-menu-skeleton')).not.toBeInTheDocument();
    expect(busyWrapper).not.toHaveAttribute('aria-busy');
  });

  it('triggers idle prefetching for CMS menu items when menu items load', async () => {
    const querySpy = vi.spyOn(headlessCmsClient, 'query').mockResolvedValue({
      data: { page: null },
    } as never);

    customRender(<Navigation />, [headerMenuMock, languagesMock]);

    await waitFor(() => {
      expect(screen.getByText('Ajankohtaista')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(querySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          query: PageDocument,
          variables: { id: '/fi/pages/ajankohtaista' },
          fetchPolicy: 'cache-first',
        })
      );
    });
  });
});

describe('scheduleIdle', () => {
  it('uses window.requestIdleCallback if available and cancels correctly', () => {
    const originalRequestIdle = window.requestIdleCallback;
    const originalCancelIdle = window.cancelIdleCallback;

    const requestIdleMock = vi.fn().mockReturnValue(123);
    const cancelIdleMock = vi.fn();

    window.requestIdleCallback = requestIdleMock;
    window.cancelIdleCallback = cancelIdleMock;

    const cb = vi.fn();
    const cancel = scheduleIdle(cb);

    expect(requestIdleMock).toHaveBeenCalledWith(cb);
    cancel();
    expect(cancelIdleMock).toHaveBeenCalledWith(123);

    window.requestIdleCallback = originalRequestIdle;
    window.cancelIdleCallback = originalCancelIdle;
  });

  it('safely cancels without error even if window.cancelIdleCallback is undefined', () => {
    const originalRequestIdle = window.requestIdleCallback;
    const originalCancelIdle = window.cancelIdleCallback;

    window.requestIdleCallback = vi.fn().mockReturnValue(456);
    // @ts-expect-error test missing cancel callback
    delete window.cancelIdleCallback;

    const cb = vi.fn();
    const cancel = scheduleIdle(cb);

    expect(() => cancel()).not.toThrow();

    window.requestIdleCallback = originalRequestIdle;
    window.cancelIdleCallback = originalCancelIdle;
  });

  it('falls back to setTimeout when window.requestIdleCallback is absent', () => {
    const originalRequestIdle = window.requestIdleCallback;
    // @ts-expect-error test fallback
    delete window.requestIdleCallback;

    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const cb = vi.fn();
    const cancel = scheduleIdle(cb);

    expect(setTimeoutSpy).toHaveBeenCalledWith(cb, 50);
    cancel();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    if (originalRequestIdle) {
      window.requestIdleCallback = originalRequestIdle;
    }
  });
});

describe('extractMenuItems', () => {
  it('returns empty array when items are undefined or empty', () => {
    expect(extractMenuItems(undefined)).toEqual([]);
    expect(extractMenuItems([])).toEqual([]);
  });

  it('extracts flat and nested menu items recursively with children and childItems.nodes', () => {
    const items = [
      { id: '1', path: '/page-1' },
      {
        id: '2',
        path: '/page-2',
        children: [{ id: '2-1', path: '/page-2-1' }],
      },
      {
        id: '3',
        path: '/page-3',
        childItems: {
          nodes: [{ id: '3-1', path: '/page-3-1' }],
        },
      },
    ] as unknown as MenuItem[];

    const extracted = extractMenuItems(items);
    expect(extracted.map((i) => i.id)).toEqual(['1', '2', '2-1', '3', '3-1']);
  });
});

describe('prefetchCmsMenuItems', () => {
  it('prefetches internal CMS pages with PageDocument and articles with ArticleDocument', () => {
    const mockClient = {
      query: vi.fn().mockResolvedValue({ data: null }),
    };

    const items = [
      { id: '1', path: '/pages/ajankohtaista/' },
      { id: '2', path: '/articles/uusin-juttu' },
      { id: '3', path: '/events' }, // App route, skip
      { id: '4', path: '/profile' }, // App route, skip
      { id: '5', path: 'https://external-domain.com/something' }, // External, skip
      { id: '6', path: '/pages/ajankohtaista/' }, // Duplicate, skip
      { id: '7', path: '/home' }, // App home route, skip
      { id: '8', path: '/search' }, // App search route, skip
      { id: '9', path: '/articles' }, // Article archive root, skip
      { id: '10', path: '/articles-info' }, // Top-level non-pages slug, skip
      { id: '11', path: '/pages/tietoa-meista' }, // Valid CMS page
    ] as unknown as MenuItem[];

    prefetchCmsMenuItems(items, 'fi', mockClient as never);

    expect(mockClient.query).toHaveBeenCalledTimes(3);
    expect(mockClient.query).toHaveBeenCalledWith({
      query: PageDocument,
      variables: { id: '/fi/pages/ajankohtaista' },
      fetchPolicy: 'cache-first',
    });
    expect(mockClient.query).toHaveBeenCalledWith({
      query: ArticleDocument,
      variables: { id: '/fi/uusin-juttu' },
      fetchPolicy: 'cache-first',
    });
    expect(mockClient.query).toHaveBeenCalledWith({
      query: PageDocument,
      variables: { id: '/fi/pages/tietoa-meista' },
      fetchPolicy: 'cache-first',
    });
  });

  it('safely catches and ignores client query rejection without throwing', () => {
    const mockClient = {
      query: vi.fn().mockRejectedValue(new Error('Network error')),
    };

    const items = [{ id: '1', path: '/pages/ajankohtaista/' }] as unknown as MenuItem[];

    expect(() => {
      prefetchCmsMenuItems(items, 'fi', mockClient as never);
    }).not.toThrow();
  });
});

describe('getUserDisplayInfo', () => {
  const guardianProfileMock: MyProfile = {
    id: 'guardian-1',
    firstName: 'Maija',
    lastName: 'Meikäläinen',
    email: 'maija@example.com',
    phoneNumber: '+358401234567',
    language: Language.Fi,
    hasAcceptedCommunication: true,
    children: { edges: [] },
    languagesSpokenAtHome: { edges: [] },
  };

  it('prioritizes Kukkuu Guardian profile firstName and lastName for fullName and initials', () => {
    expect(
      getUserDisplayInfo(guardianProfileMock, {
        given_name: 'OidcFirst',
        family_name: 'OidcLast',
        email: 'oidc@example.com',
      })
    ).toEqual({
      fullName: 'Maija Meikäläinen',
      initials: 'MM',
    });
  });

  it('falls back to OIDC user profile given_name and family_name when Guardian profile is null', () => {
    expect(
      getUserDisplayInfo(null, {
        given_name: 'Matti',
        family_name: 'Meikäläinen',
        email: 'matti@example.com',
      })
    ).toEqual({
      fullName: 'Matti Meikäläinen',
      initials: 'MM',
    });
  });

  it('falls back to OIDC name or email when given_name and family_name are missing', () => {
    expect(
      getUserDisplayInfo(null, {
        name: 'Liisa Virtanen',
      })
    ).toEqual({
      fullName: 'Liisa Virtanen',
      initials: 'LV',
    });

    expect(
      getUserDisplayInfo(null, {
        email: 'test@hel.fi',
      })
    ).toEqual({
      fullName: 'test@hel.fi',
      initials: 'T',
    });
  });

  it('returns empty strings when both profiles are empty', () => {
    expect(getUserDisplayInfo(null, null)).toEqual({
      fullName: '',
      initials: '',
    });
  });
});

describe('<UserNavigation />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders login button when unauthenticated and calls login on click', async () => {
    const user = userEvent.setup();
    const loginMock = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(HdsReact, 'useOidcClient').mockReturnValue({
      isAuthenticated: () => false,
      isRenewing: () => false,
      login: loginMock,
    } as never);

    customRender(
      <HdsReact.Header>
        <HdsReact.Header.ActionBar
          title="Kulttuurin kummilapset"
          frontPageLabel="Kulttuurin kummilapset"
          titleHref="#"
          logo={<HdsReact.Logo src="dummy" alt="Helsinki" />}
        >
          <UserNavigation fixedRightPosition />
        </HdsReact.Header.ActionBar>
      </HdsReact.Header>
    );

    const signInButton = screen.getByRole('button', { name: 'Kirjaudu' });
    expect(signInButton).toBeInTheDocument();

    await user.click(signInButton);
    expect(loginMock).toHaveBeenCalledTimes(1);
  });

  it('renders initials avatar, full name, and profile dropdown items when authenticated', async () => {
    const user = userEvent.setup();
    const logoutMock = vi.fn();
    const navigateMock = vi.fn().mockResolvedValue(undefined);
    const windowOpenSpy = vi
      .spyOn(globalThis.window, 'open')
      .mockImplementation(() => null);
    vi.spyOn(AppConfig, 'helsinkiProfileUrl', 'get').mockReturnValue(
      'https://profiili.test.hel.ninja'
    );

    vi.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateMock);
    vi.spyOn(UseLogoutModule, 'default').mockReturnValue(logoutMock);
    vi.spyOn(HdsReact, 'useOidcClient').mockReturnValue({
      isAuthenticated: () => true,
      isRenewing: () => false,
      login: vi.fn(),
    } as never);
    vi.spyOn(HdsReact, 'useAuthenticatedUser').mockReturnValue({
      profile: {
        given_name: 'Maija',
        family_name: 'Meikäläinen',
      },
    } as never);
    vi.spyOn(ProfileContext, 'useProfileContext').mockReturnValue({
      profile: {
        id: 'guardian-1',
        firstName: 'Maija',
        lastName: 'Meikäläinen',
        email: 'maija@example.com',
        phoneNumber: '+358401234567',
        language: Language.Fi,
        hasAcceptedCommunication: true,
        children: { edges: [] },
        languagesSpokenAtHome: { edges: [] },
      },
      isLoading: false,
      isFetchCalled: true,
      clearProfile: vi.fn(),
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
    });

    customRender(
      <HdsReact.Header>
        <HdsReact.Header.ActionBar
          title="Kulttuurin kummilapset"
          frontPageLabel="Kulttuurin kummilapset"
          titleHref="#"
          logo={<HdsReact.Logo src="dummy" alt="Helsinki" />}
        >
          <UserNavigation fixedRightPosition />
        </HdsReact.Header.ActionBar>
      </HdsReact.Header>
    );

    expect(screen.getByText('MM')).toBeInTheDocument();

    const toggleButton = screen.getByRole('button', {
      name: 'Maija Meikäläinen',
    });
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);

    // Full name heading is rendered inside the opened dropdown
    expect(
      screen.getByRole('heading', { name: 'Maija Meikäläinen' })
    ).toBeInTheDocument();

    const helsinkiProfileButton = screen.getByRole('button', {
      name: /Helsinki-profiili/i,
    });
    expect(helsinkiProfileButton).toBeInTheDocument();

    const logoutItem = screen.getByRole('button', {
      name: 'Kirjaudu ulos',
    });
    expect(logoutItem).toBeInTheDocument();

    await user.click(helsinkiProfileButton);
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://profiili.test.hel.ninja',
      '_blank',
      'noopener,noreferrer'
    );
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    // Reopen dropdown and query profile button afresh before clicking
    await user.click(toggleButton);
    const profileItem = screen.getByRole('button', {
      name: 'Kulttuurilapset-profiili',
    });
    expect(profileItem).toBeInTheDocument();
    await user.click(profileItem);
    expect(navigateMock).toHaveBeenCalledWith('/profile');
    // Ensure clicking profile button closes the user dropdown menu
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    // Re-open for testing logout
    await user.click(toggleButton!);
    const updatedLogoutItem = screen.getByRole('button', {
      name: 'Kirjaudu ulos',
    });
    await user.click(updatedLogoutItem);
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});

describe('navigation menu close helpers', () => {
  it('closeUserDropdown clicks toggle button when open', () => {
    const container = document.createElement('div');
    container.id = 'userDropdownButton';
    const button = document.createElement('button');
    button.setAttribute('aria-expanded', 'true');
    const clickSpy = vi.fn();
    button.addEventListener('click', clickSpy);
    container.appendChild(button);
    document.body.appendChild(container);

    closeUserDropdown();
    expect(clickSpy).toHaveBeenCalledTimes(1);

    document.body.removeChild(container);
  });

  it('closeUserDropdown does nothing when toggle button is closed', () => {
    const container = document.createElement('div');
    container.id = 'userDropdownButton';
    const button = document.createElement('button');
    button.setAttribute('aria-expanded', 'false');
    const clickSpy = vi.fn();
    button.addEventListener('click', clickSpy);
    container.appendChild(button);
    document.body.appendChild(container);

    closeUserDropdown();
    expect(clickSpy).not.toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it('closeMobileMenu clicks mobile menu button when open', () => {
    const container = document.createElement('div');
    container.id = 'Menu';
    const button = document.createElement('button');
    button.setAttribute('aria-expanded', 'true');
    const clickSpy = vi.fn();
    button.addEventListener('click', clickSpy);
    container.appendChild(button);
    document.body.appendChild(container);

    closeMobileMenu();
    expect(clickSpy).toHaveBeenCalledTimes(1);

    document.body.removeChild(container);
  });

  it('closeNavigationMenu closes both user dropdown and mobile menu', () => {
    const userContainer = document.createElement('div');
    userContainer.id = 'userDropdownButton';
    const userBtn = document.createElement('button');
    userBtn.setAttribute('aria-expanded', 'true');
    const userClickSpy = vi.fn();
    userBtn.addEventListener('click', userClickSpy);
    userContainer.appendChild(userBtn);

    const mobileContainer = document.createElement('div');
    mobileContainer.id = 'Menu';
    const mobileBtn = document.createElement('button');
    mobileBtn.setAttribute('aria-expanded', 'true');
    const mobileClickSpy = vi.fn();
    mobileBtn.addEventListener('click', mobileClickSpy);
    mobileContainer.appendChild(mobileBtn);

    document.body.appendChild(userContainer);
    document.body.appendChild(mobileContainer);

    closeNavigationMenu();
    expect(userClickSpy).toHaveBeenCalledTimes(1);
    expect(mobileClickSpy).toHaveBeenCalledTimes(1);

    document.body.removeChild(userContainer);
    document.body.removeChild(mobileContainer);
  });
});
