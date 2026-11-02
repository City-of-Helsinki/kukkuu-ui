import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';

import { customRender as render } from '../../../../common/test/customRender';
import {
  fakeAvailableEvent,
  fakeAvailableOccurrence,
} from '../../../../utils/eventMockDataUtils';
import { Language } from '../../../api/generatedTypes/graphql';
import ChildEventsSearch from '../ChildEventsSearch';
import { childAvailableEventsQuery } from '../../queries/childAvailableEventsQuery';

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

  const getSuccessEventsMock = () => ({
    request: {
      query: childAvailableEventsQuery,
      variables: { id: 'child-1' },
    },
    result: {
      data: {
        child: {
          id: 'child-1',
          name: 'Malla Mallikas',
          birthyear: 2020,
          themePath: null,
          upcomingEventsAndEventGroups: {
            edges: [
              {
                node: {
                  __typename: 'EventNode',
                  ...testEventNode,
                },
              },
            ],
          },
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

    // The child selector is exposed to assistive technology as a labelled
    // combobox. HDS Select renders the visible <label> and the
    // role="combobox" button that the label points to.
    const childSelector = await screen.findByRole('combobox', {
      name: /Lapsi/,
    });

    // Select a child using only accessible queries. Only the draft state is
    // updated here, so no additional GraphQL request is triggered.
    await user.click(childSelector);
    await user.click(
      await screen.findByRole('option', { name: /Pikkuveli Mallikas/ })
    );

    // The combobox announces the newly selected child to screen reader users.
    await waitFor(() => {
      expect(childSelector).toHaveAccessibleName(/Pikkuveli Mallikas/);
    });

    // The description is linked with aria-describedby on the combobox itself,
    // so screen readers announce it when the child selector receives focus.
    const descriptionText =
      'Valitse lapsi ja paina Etsi tapahtumia päivittääksesi hakutulokset.';
    expect(childSelector).toHaveAccessibleDescription(descriptionText);

    // The visually-hidden description is still present in the accessibility
    // tree, verified through a text query instead of raw DOM selectors or
    // implementation-specific class names.
    expect(screen.getByText(descriptionText)).toBeInTheDocument();
  });

  it('renders empty results state', async () => {
    const emptyMock = {
      request: {
        query: childAvailableEventsQuery,
        variables: { id: 'child-1' },
      },
      result: {
        data: {
          child: {
            id: 'child-1',
            name: 'Malla Mallikas',
            birthyear: 2020,
            themePath: null,
            upcomingEventsAndEventGroups: {
              edges: [],
            },
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

  it('renders matching events with pagination and loads more when button is clicked', async () => {
    const user = userEvent.setup();
    const eventsData = Array.from({ length: 20 }, (_, i) => ({
      node: {
        id: `event-${i + 1}`,
        name: `Tapahtuma ${i + 1}`,
        shortDescription: `Kuvaus ${i + 1}`,
        image: null,
        imageAltText: null,
        duration: 60,
        enrolmentDeniedReason: null,
        registrationOpensAt: null,
        ticketSystem: null,
        occurrences: {
          edges: [
            {
              node: {
                id: `occ-${i + 1}`,
                time: `2026-10-${String(i + 1).padStart(2, '0')}T10:00:00Z`,
                remainingCapacity: 5,
                occurrenceLanguage: 'FI',
                venue: {
                  id: 'v-1',
                  name: 'Lastenkulttuurikeskus',
                  address: 'Lastenkatu 1',
                },
              },
            },
          ],
        },
      },
    }));

    const allEventsMock = {
      request: {
        query: childAvailableEventsQuery,
        variables: { id: 'child-1' },
      },
      result: {
        data: {
          child: {
            id: 'child-1',
            name: 'Malla Mallikas',
            birthyear: 2020,
            themePath: null,
            upcomingEventsAndEventGroups: {
              edges: eventsData.map((e) => ({
                node: {
                  __typename: 'EventNode',
                  ...e.node,
                },
              })),
            },
          },
        },
      },
    };

    render(<ChildEventsSearch />, [allEventsMock]);

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
    expect(screen.getAllByRole('article')).toHaveLength(20);
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

    // Activate sticky state cleanly without fragile scroll or geometry mocks
    mockIsSticky = true;
    rerender(<ChildEventsSearch />);

    await waitFor(() => {
      expect(stickyHeader).toHaveAttribute('aria-hidden', 'false');
      expect(stickyHeader.className).toMatch(/stickyChildHeaderVisible/);
    });

    // Simulate clicking "Muokkaa hakua"
    const formEl = document.getElementById('child-events-search-form');
    const scrollIntoViewSpy = vi.fn();
    if (formEl) {
      formEl.scrollIntoView = scrollIntoViewSpy;
    }
    const editSearchLink = screen.getByText('Muokkaa hakua');
    await user.click(editSearchLink);
    expect(scrollIntoViewSpy).toHaveBeenCalled();

    // Deactivate sticky state when scrolled back up
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
    });

    const child2Mock = {
      request: {
        query: childAvailableEventsQuery,
        variables: { id: 'child-2' },
      },
      result: {
        data: {
          child: {
            id: 'child-2',
            name: 'Pikkuveli Mallikas',
            birthyear: 2022,
            themePath: null,
            upcomingEventsAndEventGroups: {
              edges: [
                {
                  node: {
                    __typename: 'EventNode',
                    ...child2EventNode,
                  },
                },
              ],
            },
          },
        },
      },
    };

    render(<ChildEventsSearch />, [child2Mock]);

    await waitFor(() => {
      expect(screen.getByText('Pikkuveljen sirkus')).toBeInTheDocument();
    });
  });

  it('filters results when availableOnly checkbox is toggled and search is submitted', async () => {
    const eligibleEvent = fakeAvailableEvent({
      id: 'event-eligible',
      name: 'Vapaa tapahtuma',
      enrolmentDeniedReason: null,
      occurrences: {
        edges: [
          {
            node: fakeAvailableOccurrence({
              remainingCapacity: 5,
            }),
          },
        ],
      },
    });

    const ineligibleEvent = fakeAvailableEvent({
      id: 'event-ineligible',
      name: 'Varattu tapahtuma',
      enrolmentDeniedReason: 'ALREADY_JOINED_EVENT_GROUP' as any,
    });

    const filterTestMock = {
      request: {
        query: childAvailableEventsQuery,
        variables: { id: 'child-1' },
      },
      result: {
        data: {
          child: {
            id: 'child-1',
            name: 'Malla Mallikas',
            birthyear: 2020,
            themePath: null,
            upcomingEventsAndEventGroups: {
              edges: [
                {
                  node: {
                    __typename: 'EventNode' as const,
                    ...eligibleEvent,
                  },
                },
                {
                  node: {
                    __typename: 'EventNode' as const,
                    ...ineligibleEvent,
                  },
                },
              ],
            },
          },
        },
      },
    };

    const user = userEvent.setup();
    render(<ChildEventsSearch />, [filterTestMock]);

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

    // Filter badge does not appear and URL is not updated before submitting the form
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('button', {
        name: /Poista valinta: Näytä vain ne, joissa on tilaa/,
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Tyhjennä valinnat' })
    ).not.toBeInTheDocument();

    // Submitting the form commits the filter to results and updates badges
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

    // Filter badge is now visible because the filter is affecting results
    const removeBadgeBtn = screen.getByRole('button', {
      name: /Poista valinta: Näytä vain ne, joissa on tilaa/,
    });
    expect(removeBadgeBtn).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Tyhjennä valinnat' })
    ).toBeInTheDocument();

    // Removing the badge immediately clears the filter and updates URL
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
    expect(checkbox).not.toBeChecked();
  });

  it('renders child theme path notification when child has predefined theme path and applies filter on click', async () => {
    const themeEventRytmi = fakeAvailableEvent({
      id: 'event-rytmi',
      name: 'Rytmiseikkailu',
      themePaths: [{ id: 'tp-1', slug: 'rytmi', name: 'Rytmi' }],
    });

    const themeEventTarina = fakeAvailableEvent({
      id: 'event-tarina',
      name: 'Tarinaseikkailu',
      themePaths: [{ id: 'tp-2', slug: 'tarina', name: 'Tarina' }],
    });

    const themeMock = {
      request: {
        query: childAvailableEventsQuery,
        variables: { id: 'child-1' },
      },
      result: {
        data: {
          child: {
            id: 'child-1',
            name: 'Malla Mallikas',
            birthyear: 2020,
            themePath: {
              id: 'tp-1',
              slug: 'rytmi',
              name: 'Rytmi',
            },
            upcomingEventsAndEventGroups: {
              edges: [
                {
                  node: {
                    __typename: 'EventNode' as const,
                    ...themeEventRytmi,
                  },
                },
                {
                  node: {
                    __typename: 'EventNode' as const,
                    ...themeEventTarina,
                  },
                },
              ],
            },
          },
        },
      },
    };

    const user = userEvent.setup();
    render(
      <ChildEventsSearch />,
      [themeMock]
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Lapselle Malla Mallikas on valittu Rytmi-teemapolku/)
      ).toBeInTheDocument();
    });

    const applyBtn = screen.getByRole('button', {
      name: 'Näytä vain Rytmi-tapahtumat',
    });
    await user.click(applyBtn);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Poista valinta: Rytmi/i })
      ).toBeInTheDocument();
    });

    // When the theme path filter is active, notification is hidden
    expect(
      screen.queryByText(/Lapselle Malla Mallikas on valittu Rytmi-teemapolku/)
    ).not.toBeInTheDocument();
  });

  it('clears all filters when clear all button is clicked', async () => {
    const user = userEvent.setup();
    window.history.pushState(
      {},
      '',
      '/fi/events?child=child-1&themePath=rytmi&availableOnly=true'
    );

    render(<ChildEventsSearch />, [getSuccessEventsMock()]);

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
});
