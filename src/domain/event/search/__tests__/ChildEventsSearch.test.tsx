import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import {
  fakeAvailableEvent,
  fakeAvailableOccurrence,
} from '../../../../utils/eventMockDataUtils';
import ChildEventsSearch from '../ChildEventsSearch';
import { childAvailableEventsQuery } from '../../queries/childAvailableEventsQuery';

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>(
    'react-router'
  );
  return {
    ...actual,
    useParams: () => ({ childId: 'child-1' }),
    useNavigate: () => {
      const realNavigate = actual.useNavigate();
      return ((...args: Parameters<typeof realNavigate>) => {
        mockNavigate(...args);
        return (realNavigate as any)(...args);
      }) as typeof realNavigate;
    },
  };
});

vi.mock('../../../profile/hooks/useProfileContext', () => ({
  useProfileContext: () => ({
    profile: {
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
    },
  }),
}));

describe('ChildEventsSearch', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  const testEventNode = fakeAvailableEvent({
    id: 'event-1',
    name: 'Kulttuuriseikkailu',
    shortDescription: 'Seikkailua lapsille',
    duration: 60,
    canChildEnroll: true,
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

  const successEventsMock = {
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
          availableEvents: {
            edges: [{ node: testEventNode }],
          },
        },
      },
    },
  };

  it('renders hero, title, filter accordion, results count, and event card', async () => {
    render(<ChildEventsSearch />, [successEventsMock]);

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
            availableEvents: {
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
        canChildEnroll: true,
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
            availableEvents: {
              edges: eventsData,
            },
          },
        },
      },
    };

    render(<ChildEventsSearch pageSize={15} />, [
      paginatedMock,
      paginatedMock,
    ]);

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
    render(<ChildEventsSearch />, [successEventsMock]);

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
      successEventsMock,
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
      [successEventsMock]
    );

    await waitFor(() => {
      expect(
        screen.getByText('Oma kuvausteksti tähän.')
      ).toBeInTheDocument();
    });
  });
});
