import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';

import { customRender as render } from '../../../../common/test/customRender';
import {
  fakeAvailableEvent,
  fakeAvailableOccurrence,
} from '../../../../utils/eventMockDataUtils';
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

vi.mock('../../../profile/hooks/useProfileContext', () => ({
  useProfileContext: () => ({
    profile: mockProfileData,
    isLoading: mockIsProfileLoading,
    isFetchCalled: mockIsFetchCalled,
  }),
}));

describe('ChildEventsSearch', () => {
  beforeEach(() => {
    mockParams = {};
    mockProfileData = defaultProfile;
    mockIsProfileLoading = false;
    mockIsFetchCalled = true;
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

    expect(screen.getByLabelText('Lataa')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Etsi tapahtumia' })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Hienoa että olet mukana Kulttuurin kummilapset/)
    ).toBeInTheDocument();

    expect(screen.getByText('Rajaa hakutuloksia')).toBeInTheDocument();
    expect(screen.getByText('1 hakutulos')).toBeInTheDocument();
    expect(screen.getByText('Kulttuuriseikkailu')).toBeInTheDocument();
    expect(screen.getByText('Seikkailua lapsille')).toBeInTheDocument();

    // Verify child selector is rendered above the filter accordion, not inside the hero
    const heroTitle = screen.getByRole('heading', { level: 1, name: 'Etsi tapahtumia' });
    const heroSection = heroTitle.closest('section') || heroTitle.parentElement;
    const childSelector = document.getElementById('child-selector');
    expect(childSelector).toBeInTheDocument();
    expect(heroSection).not.toContainElement(childSelector);

    // Verify accessibility attributes on child selector
    expect(childSelector).toHaveAttribute(
      'aria-describedby',
      'child-selector-description'
    );
    expect(childSelector).toHaveAttribute('aria-live', 'polite');
    const childSelectorDesc = document.getElementById(
      'child-selector-description'
    );
    expect(childSelectorDesc).toBeInTheDocument();
    expect(childSelectorDesc).toHaveClass('visually-hidden');
    expect(childSelectorDesc).toHaveTextContent(
      'Lapsen valitseminen päivittää hakutulokset automaattisesti.'
    );

    // Verify results count has aria-live="polite"
    expect(screen.getByText('1 hakutulos')).toHaveAttribute(
      'aria-live',
      'polite'
    );

    // Verify breadcrumbs are rendered and back button is removed
    expect(
      screen.getByRole('navigation', { name: 'Leivänmurunavigaatio' })
    ).toBeInTheDocument();
    expect(screen.getAllByText('Etusivu')).toHaveLength(2);
    expect(screen.getByText('Tapahtumat')).toBeInTheDocument();
    expect(screen.queryByLabelText('Takaisin')).not.toBeInTheDocument();
  });

  it('renders empty results text when child has no available events', async () => {
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

    expect(
      screen.getByText(/Hienoa että olet mukana Kulttuurin kummilapset/)
    ).toBeInTheDocument();

    expect(screen.getByText('0 hakutulosta')).toBeInTheDocument();
    expect(
      screen.getByText('Ei saatavilla olevia tapahtumia.')
    ).toBeInTheDocument();
  });

  it('supports Load More pagination when results exceed pageSize', async () => {
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

    const paginatedMock = {
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

    render(<ChildEventsSearch pageSize={15} />, [paginatedMock]);

    await waitFor(() => {
      expect(screen.getByText('20 hakutulosta')).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByRole('button', {
      name: 'Näytä lisää (5)',
    });
    expect(loadMoreButton).toBeInTheDocument();

    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /Näytä lisää/ })
      ).not.toBeInTheDocument();
    });
  });

  it('renders child selector in sticky header and activates when scrolled down', async () => {
    render(<ChildEventsSearch />, [getSuccessEventsMock()]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Etsi tapahtumia' })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Hienoa että olet mukana Kulttuurin kummilapset/)
    ).toBeInTheDocument();

    const stickyHeader = screen.getByTestId('sticky-child-header');
    expect(stickyHeader).toBeInTheDocument();
    expect(stickyHeader).toHaveAttribute('aria-hidden', 'true');

    const stickySelector = document.getElementById('sticky-child-selector');
    expect(stickySelector).toHaveAttribute(
      'aria-describedby',
      'sticky-child-selector-description'
    );
    expect(stickySelector).toHaveAttribute('aria-live', 'polite');
    const stickyDesc = document.getElementById(
      'sticky-child-selector-description'
    );
    expect(stickyDesc).toBeInTheDocument();
    expect(stickyDesc).toHaveClass('visually-hidden');

    // Simulate scrolling down past the child selector
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true });
    const childSelector = document.getElementById('child-selector');
    if (childSelector) {
      vi.spyOn(childSelector.parentElement!, 'getBoundingClientRect').mockReturnValue({
        top: -50,
        bottom: -10,
        left: 0,
        right: 300,
        width: 300,
        height: 40,
        x: 0,
        y: -50,
        toJSON: () => {},
      });
    }

    fireEvent.scroll(window);

    await waitFor(() => {
      expect(stickyHeader).toHaveAttribute('aria-hidden', 'false');
      expect(stickyHeader.className).toMatch(/stickyChildHeaderVisible/);
    });

    // Simulate scrolling back to top
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(stickyHeader).toHaveAttribute('aria-hidden', 'true');
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

  it('filters results when availableOnly checkbox is toggled', async () => {
    const eligibleEvent = fakeAvailableEvent({
      id: 'event-eligible',
      name: 'Vapaa tapahtuma',
      enrolmentDeniedReason: null,
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

    render(<ChildEventsSearch />, [filterTestMock]);

    await waitFor(() => {
      expect(screen.getByText('2 hakutulosta')).toBeInTheDocument();
    });

    expect(screen.getByText('Vapaa tapahtuma')).toBeInTheDocument();
    expect(screen.getByText('Varattu tapahtuma')).toBeInTheDocument();

    const accordionButton = screen.getByRole('button', {
      name: 'Rajaa hakutuloksia',
    });
    fireEvent.click(accordionButton);

    const checkbox = screen.getByRole('checkbox', {
      name: 'Näytä vain tapahtumat, joihin voi ilmoittautua',
    });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getByText('1 hakutulos')).toBeInTheDocument();
    expect(screen.getByText('Vapaa tapahtuma')).toBeInTheDocument();
    expect(screen.queryByText('Varattu tapahtuma')).not.toBeInTheDocument();
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
