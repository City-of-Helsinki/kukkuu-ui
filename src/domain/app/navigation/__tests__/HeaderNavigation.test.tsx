import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ConfigProvider,
  defaultConfig,
  LanguageCodeEnum,
  type Menu,
  type MenuItem,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import { Logo, LogoSize, logoFi } from 'hds-react';

import HeaderNavigation from '../HeaderNavigation';
import { customRender } from '../../../../common/test/customRender';
import { HARDCODED_CMS_LANGUAGES } from '../../../languages/constants';

const mockMenu: Menu = {
  id: 'test-menu',
  menuItems: {
    nodes: [
      {
        id: 'item-1',
        title: 'Tapahtumat',
        label: 'Tapahtumat',
        path: '/events',
        parentId: null,
      },
      {
        id: 'item-2',
        title: 'Tietoa meistä',
        label: 'Tietoa meistä',
        path: '/about',
        parentId: null,
      },
      {
        id: 'sub-item-1',
        title: 'Historia',
        label: 'Historia',
        path: '/about/history',
        parentId: 'item-2',
      },
    ],
  },
};

describe('<HeaderNavigation />', () => {
  it('renders default site name, skip link, logo, and CMS menu links', () => {
    customRender(
      <HeaderNavigation
        menu={mockMenu}
        languages={[...HARDCODED_CMS_LANGUAGES]}
      />
    );

    // Skip to content link pointing to #main_content
    const skipLink = screen.getByText('skip to content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink.closest('a')).toHaveAttribute('href', '#main_content');

    // Default site title from rhhcDefaultConfig
    const titleLink = screen.getByText('Test site');
    expect(titleLink).toBeInTheDocument();
    expect(titleLink.closest('a')).toHaveAttribute('href', '/');

    // Menu links
    expect(screen.getByText('Tapahtumat')).toBeInTheDocument();
    expect(screen.getByText('Tietoa meistä')).toBeInTheDocument();
  });

  it('renders custom title, titleHref, logoHref, and frontPageLabel when provided', () => {
    customRender(
      <HeaderNavigation
        menu={mockMenu}
        title="Custom Kukkuu"
        titleHref="/custom-root"
        logoHref="/custom-logo-root"
        frontPageLabel="Custom Frontpage"
      />
    );

    const titleElement = screen.getByText('Custom Kukkuu');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.closest('a')).toHaveAttribute('href', '/custom-root');

    // Logo link has custom logoHref
    const logoLink = document.querySelector('a[aria-label="Helsingin kaupunki"]');
    expect(logoLink).toHaveAttribute('href', '/custom-logo-root');
  });

  it('renders custom logo element when provided', () => {
    customRender(
      <HeaderNavigation
        menu={mockMenu}
        logo={<Logo src={logoFi} alt="Custom Alt Logo" size={LogoSize.Large} />}
      />
    );

    expect(screen.getByAltText('Custom Alt Logo')).toBeInTheDocument();
  });

  it('renders desktop and mobile drawer skeletons when isLoading is true', () => {
    customRender(
      <HeaderNavigation
        menu={mockMenu}
        isLoading={true}
      />
    );

    expect(screen.getByTestId('nav-menu-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-nav-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Tapahtumat')).not.toBeInTheDocument();
  });

  it('renders custom renderSkeleton function when provided', () => {
    customRender(
      <HeaderNavigation
        menu={mockMenu}
        isLoading={true}
        renderSkeleton={() => (
          <div data-testid="custom-skeleton">Loading skeleton...</div>
        )}
      />
    );

    expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-menu-skeleton')).not.toBeInTheDocument();
  });

  it('merges staticItems with CMS menu nodes', () => {
    const staticItems: MenuItem[] = [
      {
        id: 'static-item-1',
        title: 'Ohjeet',
        label: 'Ohjeet',
        path: '/instructions',
        parentId: null,
      },
    ];

    customRender(
      <HeaderNavigation
        menu={mockMenu}
        staticItems={staticItems}
      />
    );

    expect(screen.getByText('Tapahtumat')).toBeInTheDocument();
    expect(screen.getByText('Ohjeet')).toBeInTheDocument();
  });

  it('triggers onTitleClick and onLogoClick handlers when clicked', async () => {
    const user = userEvent.setup();
    const onTitleClickMock = vi.fn();
    const onLogoClickMock = vi.fn();

    customRender(
      <HeaderNavigation
        menu={mockMenu}
        title="Kulttuurin kummilapset"
        onTitleClick={onTitleClickMock}
        onLogoClick={onLogoClickMock}
      />
    );

    const titleLink = screen.getByText('Kulttuurin kummilapset');
    await user.click(titleLink);
    expect(onTitleClickMock).toHaveBeenCalledTimes(1);

    const logoLink = document.querySelector('a[aria-label="Helsingin kaupunki"]');
    await user.click(logoLink!);
    expect(onLogoClickMock).toHaveBeenCalledTimes(1);
  });

  it('resolves localized root path for non-default language (e.g. Swedish /sv)', () => {
    const svConfig = {
      ...defaultConfig,
      siteName: 'Kulturbarnen',
      currentLanguageCode: LanguageCodeEnum.Sv,
    };

    customRender(
      <ConfigProvider config={svConfig}>
        <HeaderNavigation
          menu={mockMenu}
          languages={[...HARDCODED_CMS_LANGUAGES]}
        />
      </ConfigProvider>
    );

    const titleLink = screen.getByText('Kulturbarnen');
    expect(titleLink.closest('a')).toHaveAttribute('href', '/sv');
  });

  it('triggers onDidChangeLanguage and calls redirectToUrl when selecting a language', async () => {
    const user = userEvent.setup();
    const redirectToUrlMock = vi.fn();
    const getPathnameForLanguageMock = vi.fn().mockReturnValue('/sv/events');

    const customConfig = {
      ...defaultConfig,
      siteName: 'Kulttuurin kummilapset',
      currentLanguageCode: LanguageCodeEnum.Fi,
      utils: {
        ...defaultConfig.utils,
        redirectToUrl: redirectToUrlMock,
      },
    };

    customRender(
      <ConfigProvider config={customConfig}>
        <HeaderNavigation
          menu={mockMenu}
          languages={[...HARDCODED_CMS_LANGUAGES]}
          getPathnameForLanguage={getPathnameForLanguageMock}
        />
      </ConfigProvider>
    );

    // Click language switcher to open language list
    const languageButton = screen.getByRole('button', { name: /suomi/i });
    await user.click(languageButton);

    const svOption = screen.getByRole('button', { name: /svenska/i });
    await user.click(svOption);

    expect(getPathnameForLanguageMock).toHaveBeenCalled();
    expect(redirectToUrlMock).toHaveBeenCalledWith('/sv/events');
  });
});
