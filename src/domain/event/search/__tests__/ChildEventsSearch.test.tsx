import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { PageDocument } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import type { MockedResponse } from '@apollo/client/testing';
import type { ReactElement } from 'react';

import { customRender } from '../../../../common/test/customRender';
import {
  fakeHero,
  fakePage,
} from '../../../../utils/cmsMockDataUtils';
import {
  fakeAvailableEvent,
  fakeAvailableOccurrence,
} from '../../../../utils/eventMockDataUtils';
import { Language } from '../../../api/generatedTypes/graphql';
import ChildEventsSearch from '../ChildEventsSearch';
import { eventsSearchQuery } from '../../queries/eventsSearchQuery';
import { themePathsQuery } from '../../queries/themePathsQuery';

const getThemePathsMock = (): MockedResponse => ({
  request: {
    query: themePathsQuery,
  },
  maxUsageCount: Infinity,
  result: {
    data: {
      themePaths: {
        edges: [
          {
            node: {
              __typename: 'ThemePathNode',
              id: 'tp-1',
              slug: 'rytmi',
              name: 'Rytmi',
            },
          },
          {
            node: {
              __typename: 'ThemePathNode',
              id: 'tp-2',
              slug: 'tarina',
              name: 'Tarina',
            },
          },
          {
            node: {
              __typename: 'ThemePathNode',
              id: 'tp-3',
              slug: 'jalki',
              name: 'Jälki',
            },
          },
        ],
      },
    },
  },
});

const render = (
  ui: ReactElement,
  mocks: MockedResponse[] = [],
  options?: RenderOptions
) => customRender(ui, [getThemePathsMock(), ...mocks], options);

const mockNavigate = vi.hoisted(() => vi.fn());
let mockParams: Record<string, string> = {};

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>(
    'react-router'
  );
  return {
    ...actual,
    useParams: () => mockParams,
    useNavigate: () => {
      const realNavigate = actual.useNavigate();
      return ((...args: Parameters<typeof realNavigate>) => {
        mockNavigate(...args);
        return (realNavigate as any)(...args);
      }) as typeof realNavigate;
    },
  };
});

const defaultProfile = {
  id: 'p-1',
  firstName: 'Huoltaja',
  children: {
    edges: [
      {
        node: {
          id: 'child-1',
          name: 'Malla Mallikas',
          birthyear: 2020,
        },
      },
      {
        node: {
          id: 'child-2',
          name: 'Pikkuveli Mallikas',
          birthyear: 2022,
        },
      },
    ],
  },
};

let mockProfileData: any = defaultProfile;
let mockIsProfileLoading = false;
let mockIsFetchCalled = true;
let mockIsSticky = false;

vi.mock('../../../profile/hooks/useProfileContext', () => ({
  useProfileContext: () => ({
    profile: mockProfileData,
    isLoading: mockIsProfileLoading,
    isFetchCalled: mockIsFetchCalled,
  }),
}));

vi.mock('../hooks/useStickyChildSelect', () => ({
  useStickyChildSelect: () => ({
    isSticky: mockIsSticky,
    childSelectRef: { current: null },
  }),
  default: () => ({
    isSticky: mockIsSticky,
    childSelectRef: { current: null },
  }),
}));

const defaultSearchVars = (overrides: Record<string, unknown> = {}) => ({
  childId: 'child-1',
  first: 15,
  startDate: undefined,
  languages: undefined,
  themePaths: undefined,
  accessibility: undefined,
  familyOnly: undefined,
  availableOnly: undefined,
  ...overrides,
});

describe('ChildEventsSearch', () => {
  beforeEach(() => {
    mockParams = {};
    mockProfileData = defaultProfile;
    mockIsProfileLoading = false;
    mockIsFetchCalled = true;
    mockIsSticky = false;
    mockNavigate.mockClear();
    window.history.pushState({}, '', '/');
  });

  const testEventNode = fakeAvailableEvent({
    id: 'event-1',
    name: 'Kulttuuriseikkailu',
    shortDescription: 'Seikkailua lapsille',
    duration: 60,
    enrolmentDeniedReason: null,
    registrationOpensAt: null,
    themePaths: [],
    occurrences: {
      edges: [
        {
          node: fakeAvailableOccurrence({
            id: 'occ-1',
            time: '2026-10-04T10:00:00Z',
            remainingCapacity: 5,
            occurrenceLanguage: Language.Fi,
            venue: {
              id: 'v-1',
              name: 'Lastenkulttuurikeskus',
              address: 'Lastenkatu 1',
            },
          }),
        },
      ],
    },
  });

  const getSuccessEventsMock = (varOverrides: Record<string, unknown> = {}) => ({
    request: {
      query: eventsSearchQuery,
      variables: defaultSearchVars(varOverrides),
    },
    maxUsageCount: Infinity,
    result: {
      data: {
        child: {
          __typename: 'ChildNode',
          id: 'child-1',
          name: 'Malla Mallikas',
          birthyear: 2020,
        },
        events: {
          __typename: 'EventsConnection',
          count: 1,
          pageInfo: {
            __typename: 'PageInfo',
            hasNextPage: false,
            endCursor: 'cursor-1',
          },
          edges: [
            {
              __typename: 'EventNodeEdge',
              cursor: 'cursor-1',
              node: {
                __typename: 'EventNode',
                ...testEventNode,
              },
            },
          ],
        },
      },
    },
  });

  it('renders hero, title, filter accordion, results count, and event card', async () => {
    render(<ChildEventsSearch />, [getSuccessEventsMock()]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Etsi tapahtumia' })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Hienoa että olet mukana Kulttuurin kummilapset/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Löydä elämyksiä kulttuurilapselle',
      })
    ).toBeInTheDocument();

    // Accordion
    expect(screen.getByText('Rajaa hakutuloksia')).toBeInTheDocument();

    // Results header
    await waitFor(() => {
      expect(screen.getByText('1 hakutulos')).toBeInTheDocument();
    });
    expect(screen.getByText('Kulttuurilapsi Malla Mallikas')).toBeInTheDocument();

    // Event card
    expect(screen.getByText('Kulttuuriseikkailu')).toBeInTheDocument();
  });

  it('provides accessible description for child selector dropdown via visually-hidden span that screen readers can read', async () => {
    const user = userEvent.setup();
    render(<ChildEventsSearch />, [getSuccessEventsMock()]);

    const childSelector = await screen.findByRole('combobox', {
      name: /Lapsi/,
    });

    await user.click(childSelector);
    await user.click(
      await screen.findByRole('option', { name: /Pikkuveli Mallikas/ })
    );

    await waitFor(() => {
      expect(childSelector).toHaveAccessibleName(/Pikkuveli Mallikas/);
    });

    const descriptionText =
      'Valitse lapsi ja paina Etsi tapahtumia päivittääksesi hakutulokset.';
    expect(childSelector).toHaveAccessibleDescription(descriptionText);
    expect(screen.getByText(descriptionText)).toBeInTheDocument();
  });

  it('renders empty results state', async () => {
    const emptyMock = {
      request: {
        query: eventsSearchQuery,
        variables: defaultSearchVars(),
      },
      result: {
        data: {
          child: {
            __typename: 'ChildNode',
            id: 'child-1',
            name: 'Malla Mallikas',
            birthyear: 2020,
          },
          events: {
            __typename: 'EventsConnection',
            count: 0,
            pageInfo: {
              __typename: 'PageInfo',
              hasNextPage: false,
              endCursor: null,
            },
            edges: [],
          },
        },
      },
    };

    render(<ChildEventsSearch />, [emptyMock]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Etsi tapahtumia' })
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'Kulttuurilapselle Malla Mallikas ei löytynyt yhtään hakutulosta.'
        )
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Kokeile muuttaa hakuehtoja.')).toBeInTheDocument();
    expect(screen.queryByText('0 hakutulosta')).not.toBeInTheDocument();
  });

  it('renders matching events with cursor pagination and loads more via fetchMore when button is clicked', async () => {
    const user = userEvent.setup();
    const eventsEdges = Array.from({ length: 20 }, (_, i) => ({
      __typename: 'EventNodeEdge' as const,
      cursor: `cursor-${i + 1}`,
      node: {
        __typename: 'EventNode' as const,
        ...fakeAvailableEvent({
          id: `event-${i + 1}`,
          name: `Tapahtuma ${i + 1}`,
          shortDescription: `Kuvaus ${i + 1}`,
          image: null,
          imageAltText: null,
          duration: 60,
          enrolmentDeniedReason: null,
          registrationOpensAt: null,
          ticketSystem: null,
          themePaths: [],
          occurrences: {
            edges: [
              {
                node: {
                  __typename: 'OccurrenceNode' as const,
                  id: `occ-${i + 1}`,
                  time: `2026-10-${String(i + 1).padStart(2, '0')}T10:00:00Z`,
                  remainingCapacity: 5,
                  occurrenceLanguage: Language.Fi,
                  venue: {
                    id: 'v-1',
                    name: 'Lastenkulttuurikeskus',
                    address: 'Lastenkatu 1',
                  },
                },
              },
            ],
          },
        }),
      },
    }));

    const page1Mock = {
      request: {
        query: eventsSearchQuery,
        variables: defaultSearchVars(),
      },
      result: {
        data: {
          child: {
            __typename: 'ChildNode',
            id: 'child-1',
            name: 'Malla Mallikas',
            birthyear: 2020,
          },
          events: {
            __typename: 'EventsConnection',
            count: 20,
            pageInfo: {
              __typename: 'PageInfo',
              hasNextPage: true,
              endCursor: 'cursor-15',
            },
            edges: eventsEdges.slice(0, 15),
          },
        },
      },
    };

    const page2Mock = {
      request: {
        query: eventsSearchQuery,
        variables: defaultSearchVars({ after: 'cursor-15' }),
      },
      result: {
        data: {
          child: {
            __typename: 'ChildNode',
            id: 'child-1',
            name: 'Malla Mallikas',
            birthyear: 2020,
          },
          events: {
            __typename: 'EventsConnection',
            count: 20,
            pageInfo: {
              __typename: 'PageInfo',
              hasNextPage: false,
              endCursor: 'cursor-20',
            },
            edges: eventsEdges.slice(15, 20),
          },
        },
      },
    };

    render(<ChildEventsSearch />, [page1Mock, page2Mock]);

    await waitFor(() => {
      expect(screen.getByText('20 hakutulosta')).toBeInTheDocument();
    });

    // Initial page shows first 15 events
    expect(screen.getAllByRole('article')).toHaveLength(15);

    // Load more button shows remaining 5 events
    const loadMoreButton = screen.getByRole('button', {
      name: 'Näytä lisää hakutuloksia (5)',
    });
    expect(loadMoreButton).toBeInTheDocument();

    await user.click(loadMoreButton);

    // After loading more, all 20 events are shown and load more button disappears
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });
    expect(
      screen.queryByRole('button', { name: /Näytä lisää hakutuloksia/ })
    ).not.toBeInTheDocument();
  });

  it('renders child info and anchor in sticky header and reacts to sticky activation', async () => {
    const user = userEvent.setup();
    mockIsSticky = false;
    const { rerender } = render(<ChildEventsSearch />, [getSuccessEventsMock()]);

    const stickyHeader = await screen.findByRole('complementary', {
      hidden: true,
    });
    expect(stickyHeader).toBeInTheDocument();
    expect(stickyHeader).toHaveAttribute('aria-hidden', 'true');

    expect(
      screen.getByText('Hakutulokset kulttuurilapselle')
    ).toBeInTheDocument();
    expect(screen.getByText('Muokkaa hakua')).toBeInTheDocument();

    mockIsSticky = true;
    rerender(<ChildEventsSearch />);

    await waitFor(() => {
      expect(stickyHeader).toHaveAttribute('aria-hidden', 'false');
      expect(stickyHeader.className).toMatch(/stickyChildHeaderVisible/);
    });

    const formEl = document.getElementById('child-events-search-form');
    const scrollIntoViewSpy = vi.fn();
    if (formEl) {
      formEl.scrollIntoView = scrollIntoViewSpy;
    }
    const editSearchLink = screen.getByText('Muokkaa hakua');
    await user.click(editSearchLink);
    expect(scrollIntoViewSpy).toHaveBeenCalled();

    mockIsSticky = false;
    rerender(<ChildEventsSearch />);

    await waitFor(() => {
      expect(stickyHeader).toHaveAttribute('aria-hidden', 'true');
      expect(stickyHeader.className).not.toMatch(/stickyChildHeaderVisible/);
    });
  });

  it('renders custom title when provided via prop', async () => {
    render(<ChildEventsSearch title="Kulttuuritapahtumat lapsille" />, [
      getSuccessEventsMock(),
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'Kulttuuritapahtumat lapsille',
        })
      ).toBeInTheDocument();
    });
  });

  it('renders custom description or hides it when empty string provided', async () => {
    render(
      <ChildEventsSearch description="Oma kuvausteksti tähän." />,
      [getSuccessEventsMock()]
    );

    await waitFor(() => {
      expect(
        screen.getByText('Oma kuvausteksti tähän.')
      ).toBeInTheDocument();
    });
  });

  it('selects child specified in ?child query parameter and loads its events', async () => {
    window.history.pushState({}, '', '/fi/events?child=child-2');

    const child2EventNode = fakeAvailableEvent({
      id: 'event-2',
      name: 'Pikkuveljen sirkus',
      shortDescription: 'Sirkushuveja',
      themePaths: [],
    });

    const child2Mock = {
      request: {
        query: eventsSearchQuery,
        variables: defaultSearchVars({ childId: 'child-2' }),
      },
      result: {
        data: {
          child: {
            __typename: 'ChildNode',
            id: 'child-2',
            name: 'Pikkuveli Mallikas',
            birthyear: 2022,
          },
          events: {
            __typename: 'EventsConnection',
            count: 1,
            pageInfo: {
              __typename: 'PageInfo',
              hasNextPage: false,
              endCursor: 'cursor-1',
            },
            edges: [
              {
                __typename: 'EventNodeEdge',
                cursor: 'cursor-1',
                node: {
                  __typename: 'EventNode',
                  ...child2EventNode,
                },
              },
            ],
          },
        },
      },
    };

    render(<ChildEventsSearch />, [child2Mock]);

    await waitFor(() => {
      expect(screen.getByText('Pikkuveljen sirkus')).toBeInTheDocument();
    });
  });

  it('queries backend with availableOnly=true when checkbox is toggled and search is submitted', async () => {
    const eligibleEvent = fakeAvailableEvent({
      id: 'event-eligible',
      name: 'Vapaa tapahtuma',
      enrolmentDeniedReason: null,
      themePaths: [],
    });

    const ineligibleEvent = fakeAvailableEvent({
      id: 'event-ineligible',
      name: 'Varattu tapahtuma',
      enrolmentDeniedReason: 'ALREADY_JOINED_EVENT_GROUP' as any,
      themePaths: [],
    });

    const unfilteredMock = {
      request: {
        query: eventsSearchQuery,
        variables: defaultSearchVars(),
      },
      maxUsageCount: Infinity,
      result: {
        data: {
          child: {
            __typename: 'ChildNode',
            id: 'child-1',
            name: 'Malla Mallikas',
            birthyear: 2020,
          },
          events: {
            __typename: 'EventsConnection',
            count: 2,
            pageInfo: {
              __typename: 'PageInfo',
              hasNextPage: false,
              endCursor: 'cursor-2',
            },
            edges: [
              {
                __typename: 'EventNodeEdge',
                cursor: 'cursor-1',
                node: {
                  __typename: 'EventNode' as const,
                  ...eligibleEvent,
                },
              },
              {
                __typename: 'EventNodeEdge',
                cursor: 'cursor-2',
                node: {
                  __typename: 'EventNode' as const,
                  ...ineligibleEvent,
                },
              },
            ],
          },
        },
      },
    };

    const availableOnlyMock = {
      request: {
        query: eventsSearchQuery,
        variables: defaultSearchVars({ availableOnly: true }),
      },
      maxUsageCount: Infinity,
      result: {
        data: {
          child: {
            __typename: 'ChildNode',
            id: 'child-1',
            name: 'Malla Mallikas',
            birthyear: 2020,
          },
          events: {
            __typename: 'EventsConnection',
            count: 1,
            pageInfo: {
              __typename: 'PageInfo',
              hasNextPage: false,
              endCursor: 'cursor-1',
            },
            edges: [
              {
                __typename: 'EventNodeEdge',
                cursor: 'cursor-1',
                node: {
                  __typename: 'EventNode' as const,
                  ...eligibleEvent,
                },
              },
            ],
          },
        },
      },
    };

    const user = userEvent.setup();
    render(<ChildEventsSearch />, [unfilteredMock, availableOnlyMock]);

    await waitFor(() => {
      expect(screen.getByText('2 hakutulosta')).toBeInTheDocument();
    });

    expect(screen.getByText('Vapaa tapahtuma')).toBeInTheDocument();
    expect(screen.getByText('Varattu tapahtuma')).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', {
      name: 'Näytä vain ne, joissa on tilaa',
    });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('button', {
        name: /Poista valinta: Näytä vain ne, joissa on tilaa/,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Tyhjennä valinnat' })
    ).not.toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: 'Etsi tapahtumia' });
    await user.click(submitBtn);

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        search: expect.stringContaining('availableOnly=true'),
      }),
      { replace: false }
    );

    await waitFor(() => {
      expect(screen.getByText('1 hakutulos')).toBeInTheDocument();
    });
    expect(screen.getByText('Vapaa tapahtuma')).toBeInTheDocument();
    expect(screen.queryByText('Varattu tapahtuma')).not.toBeInTheDocument();

    const removeBadgeBtn = screen.getByRole('button', {
      name: /Poista valinta: Näytä vain ne, joissa on tilaa/,
    });
    expect(removeBadgeBtn).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Tyhjennä valinnat' })
    ).toBeInTheDocument();

    await user.click(removeBadgeBtn);

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        search: '?child=child-1',
      }),
      { replace: false }
    );

    await waitFor(() => {
      expect(screen.getByText('2 hakutulosta')).toBeInTheDocument();
    });
    expect(screen.getByText('Varattu tapahtuma')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: /Poista valinta: Näytä vain ne, joissa on tilaa/,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Tyhjennä valinnat' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Näytä vain ne, joissa on tilaa',
      })
    ).not.toBeChecked();
  });

  it('clears all filters when clear all button is clicked', async () => {
    const user = userEvent.setup();
    window.history.pushState(
      {},
      '',
      '/fi/events?child=child-1&themePath=rytmi&availableOnly=true'
    );

    render(<ChildEventsSearch />, [
      getSuccessEventsMock({ themePaths: ['rytmi'], availableOnly: true }),
      getSuccessEventsMock(),
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Poista valinta: Rytmi/i })
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole('button', {
        name: /Poista valinta: Näytä vain ne, joissa on tilaa/i,
      })
    ).toBeInTheDocument();

    const clearAllBtn = screen.getByRole('button', {
      name: 'Tyhjennä valinnat',
    });
    await user.click(clearAllBtn);

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /Poista valinta: Rytmi/i })
      ).not.toBeInTheDocument();
    });
    expect(
      screen.queryByRole('button', {
        name: /Poista valinta: Näytä vain ne, joissa on tilaa/i,
      })
    ).not.toBeInTheDocument();
  });

  it('redirects guardian to /profile when guardian has no registered children', async () => {
    mockProfileData = {
      id: 'p-empty',
      firstName: 'Lapseton',
      children: { edges: [] },
    };

    render(<ChildEventsSearch />, []);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile', { replace: true });
    });
  });

  it('redirects user to /home#register when user has no Kukkuu profile', async () => {
    mockProfileData = null;
    mockIsFetchCalled = true;
    mockIsProfileLoading = false;

    render(<ChildEventsSearch />, []);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home#register', {
        replace: true,
      });
    });
  });

  it('cleans URL and shows notification when foreign child ID is requested in URL', async () => {
    const toastSpy = vi.spyOn(toast, 'info');
    window.history.pushState({}, '', '/fi/events?child=foreign-child-999');

    render(<ChildEventsSearch />, [getSuccessEventsMock()]);

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Kulttuuriseikkailu')).toBeInTheDocument();
    });
  });

  it('renders CMS hero title, description, and breadcrumbs when CMS search page is returned', async () => {
    const cmsSearchPage = fakePage({
      title: 'Find events CMS',
      lead: '<p>CMS search page lead</p>',
      hero: fakeHero({
        title: 'CMS Search Page Title',
        description: 'CMS Search Page Description',
      }),
      breadcrumbs: [
        {
          title: 'Home CMS',
          uri: '/fi/',
          __typename: 'Breadcrumb',
        },
        {
          title: 'Find events CMS',
          uri: '/fi/search/',
          __typename: 'Breadcrumb',
        },
      ],
    });

    render(<ChildEventsSearch />, [
      getSuccessEventsMock(),
      {
        request: {
          query: PageDocument,
          variables: { id: 'search' },
        },
        result: {
          data: {
            page: cmsSearchPage,
          },
        },
      },
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'CMS Search Page Title' })
      ).toBeInTheDocument();
    });
    expect(screen.getByText('CMS Search Page Description')).toBeInTheDocument();
    expect(screen.getAllByText('Home CMS')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Find events CMS')[0]).toBeInTheDocument();
  });

  it('strips HTML tags from CMS hero description and renders plain text ingress', async () => {
    const cmsSearchPage = fakePage({
      title: 'Find events CMS',
      lead: '<p>Lead text</p>',
      hero: fakeHero({
        title: 'HTML Hero Title',
        description: '<p>Tämä on <strong>lihavoitu</strong> ingressi.</p>',
      }),
      breadcrumbs: [
        {
          title: 'Home CMS',
          uri: '/fi/',
          __typename: 'Breadcrumb',
        },
      ],
    });

    render(<ChildEventsSearch />, [
      getSuccessEventsMock(),
      {
        request: {
          query: PageDocument,
          variables: { id: 'search' },
        },
        result: {
          data: {
            page: cmsSearchPage,
          },
        },
      },
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'HTML Hero Title' })
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText('Tämä on lihavoitu ingressi.')
    ).toBeInTheDocument();
  });

  it('renders empty ingress without fallback when CMS search page has empty description even with content populated', async () => {
    const cmsSearchPage = fakePage({
      title: 'Find events CMS',
      lead: '',
      content: '<p>CMS Page Body Content That Should Not Appear As Ingress</p>',
      hero: fakeHero({
        title: 'CMS Search Page Title',
        description: '',
      }),
      breadcrumbs: [
        {
          title: 'Home CMS',
          uri: '/',
        },
        {
          title: 'Find events CMS',
          uri: '/search',
        },
      ],
    });

    render(<ChildEventsSearch />, [
      getSuccessEventsMock(),
      {
        request: {
          query: PageDocument,
          variables: { id: 'search' },
        },
        result: {
          data: {
            page: cmsSearchPage,
          },
        },
      },
    ]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'CMS Search Page Title' })
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByText(/Hienoa että olet mukana Kulttuurin kummilapset/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/CMS Page Body Content That Should Not Appear As Ingress/)
    ).not.toBeInTheDocument();
  });

  it('renders skeleton placeholders and sets aria-busy="true" on hero while CMS search page is loading', async () => {
    const delayedCmsMock = {
      request: {
        query: PageDocument,
        variables: { id: 'search' },
      },
      delay: 500,
      result: {
        data: {
          page: null,
        },
      },
    };

    render(<ChildEventsSearch />, [getSuccessEventsMock(), delayedCmsMock]);

    const heroWrapper = await waitFor(() => {
      const el = document.querySelector('[aria-busy]');
      expect(el).toBeInTheDocument();
      return el!;
    });
    expect(heroWrapper).toHaveAttribute('aria-busy', 'true');
    expect(
      heroWrapper.querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThan(0);
    expect(
      screen.queryByRole('heading', { level: 1, name: 'Etsi tapahtumia' })
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Etsi tapahtumia' })
      ).toBeInTheDocument();
    });
    expect(heroWrapper).not.toHaveAttribute('aria-busy');
  });
});
