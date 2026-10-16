import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import ChildEventsSearch from '../ChildEventsSearch';
import { childAvailableOccurrencesQuery } from '../../queries/childAvailableOccurrencesQuery';

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ childId: 'child-1' }),
    useNavigate: () => mockNavigate,
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
  const successMock = {
    request: {
      query: childAvailableOccurrencesQuery,
      variables: { id: 'child-1' },
    },
    result: {
      data: {
        child: {
          id: 'child-1',
          name: 'Malla Mallikas',
          birthyear: 2020,
          availableEvents: {
            edges: [
              {
                node: {
                  id: 'event-1',
                  name: 'Kulttuuriseikkailu',
                  shortDescription: 'Seikkailua lapsille',
                  image: null,
                  imageAltText: null,
                  duration: 60,
                  canChildEnroll: true,
                  occurrences: {
                    edges: [
                      {
                        node: {
                          id: 'occ-1',
                          time: '2026-10-04T10:00:00Z',
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
              },
            ],
          },
        },
      },
    },
  };

  it('renders hero, greeting, filter accordion, results count, and occurrence card', async () => {
    render(<ChildEventsSearch />, [successMock]);

    expect(screen.getByLabelText('Lataa')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Hei Malla Mallikas!')).toBeInTheDocument();
    });

    expect(screen.getByText('Rajaa hakutuloksia')).toBeInTheDocument();
    expect(screen.getByText('1 hakutulos')).toBeInTheDocument();
    expect(screen.getByText('Kulttuuriseikkailu')).toBeInTheDocument();
    expect(screen.getByText('Seikkailua lapsille')).toBeInTheDocument();

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
        query: childAvailableOccurrencesQuery,
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
      expect(screen.getByText('Hei Malla Mallikas!')).toBeInTheDocument();
    });

    expect(screen.getByText('0 hakutulosta')).toBeInTheDocument();
    expect(
      screen.getByText('Ei saatavilla olevia tapahtumia.')
    ).toBeInTheDocument();
  });
});
