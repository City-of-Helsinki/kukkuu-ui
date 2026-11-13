import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { PageDocument } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import { customRender as render } from '../../../common/test/customRender';
import { fakeHero, fakePage } from '../../../utils/cmsMockDataUtils';
import HeadlessCmsPage from '../HeadlessCmsPage';

describe('<HeadlessCmsPage />', () => {
  it('renders CMS subpage title, content, and breadcrumbs', async () => {
    window.history.pushState({}, '', '/fi/ajankohtaista');

    const cmsPage = fakePage({
      title: 'Ajankohtaista',
      hero: fakeHero({
        title: 'Ajankohtaista',
      }),
      content: '<p>Ajankohtaista sisältöä</p>',
      breadcrumbs: [
        {
          title: 'Etusivu',
          uri: '/fi/',
          __typename: 'Breadcrumb',
        },
        {
          title: 'Ajankohtaista',
          uri: '/fi/ajankohtaista/',
          __typename: 'Breadcrumb',
        },
      ],
    });

    render(<HeadlessCmsPage />, [
      {
        request: {
          query: PageDocument,
          variables: { id: '/fi/ajankohtaista' },
        },
        result: {
          data: {
            page: cmsPage,
          },
        },
      },
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Ajankohtaista' })
      ).toBeInTheDocument();
    });
    expect(screen.getByText('Ajankohtaista sisältöä')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Etusivu' })).toBeInTheDocument();
  });

  it('renders accessible skeleton without spinner while page is loading', async () => {
    window.history.pushState({}, '', '/fi/tietoa-meista');

    const delayedPageMock = {
      request: {
        query: PageDocument,
        variables: { id: '/fi/tietoa-meista' },
      },
      delay: 500,
      result: {
        data: {
          page: fakePage({
            title: 'Tietoa meistä',
            hero: fakeHero({
              title: 'Tietoa meistä',
            }),
            content: '<p>Tietoa meistä sisältöä</p>',
          }),
        },
      },
    };

    render(<HeadlessCmsPage />, [delayedPageMock]);

    const skeleton = screen.getByTestId('headless-cms-page-skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(
      document.querySelector('#page-content-loading')
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Tietoa meistä' })
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByTestId('headless-cms-page-skeleton')
    ).not.toBeInTheDocument();
  });
});
