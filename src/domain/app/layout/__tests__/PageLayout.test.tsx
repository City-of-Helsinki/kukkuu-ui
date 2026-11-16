import { screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { MockedResponse } from '@apollo/client/testing';
import { graphql, HttpResponse } from 'msw';

import { customRender as render } from '../../../../common/test/customRender';
import { footerMenuMock } from '../../footer/__mocks__/footerMenuMock';
import { languagesMock } from '../../footer/__mocks__/languagesMock';
import { headerMenuMock } from '../../navigation/__mocks__/headerMenuMock';
import { notificationMock } from '../../notification/__mocks__/notificationMock';
import { server } from '../../../../test/msw/server';
import AppConfig from '../../AppConfig';
import pageQueryResponse from '../../__tests__/__mocks__/pageQueryResponse';
import PageLayout from '../PageLayout';

const mocks: MockedResponse[] = [
  footerMenuMock,
  headerMenuMock,
  languagesMock,
  notificationMock,
];

vi.mock('../../../cookieConsent/CookieConsent', () => ({
  default: vi.fn(({ isPage }: { isPage?: boolean }) => (
    <div data-testid={isPage ? 'cookie-consent-page' : 'cookie-consent-banner'} />
  )),
}));

describe('PageLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const headlessCms = graphql.link(AppConfig.cmsUri);
    server.use(
      headlessCms.query('page', () => HttpResponse.json({ ...pageQueryResponse }))
    );
  });

  it('renders CookieConsent banner on standard routes', () => {
    window.history.pushState({}, '', '/fi/home');
    render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>,
      mocks
    );

    expect(screen.getByTestId('cookie-consent-banner')).toBeInTheDocument();
  });

  it('suppresses CookieConsent banner on /fi/cookie-consent route', () => {
    window.history.pushState({}, '', '/fi/cookie-consent');
    render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>,
      mocks
    );

    expect(screen.queryByTestId('cookie-consent-banner')).not.toBeInTheDocument();
  });

  it('suppresses CookieConsent banner on /sv/cookie-consent/ with trailing slash', () => {
    window.history.pushState({}, '', '/sv/cookie-consent/');
    render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>,
      mocks
    );

    expect(screen.queryByTestId('cookie-consent-banner')).not.toBeInTheDocument();
  });
});
