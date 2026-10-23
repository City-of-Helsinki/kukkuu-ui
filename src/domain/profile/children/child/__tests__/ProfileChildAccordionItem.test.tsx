import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { customRender as render } from '../../../../../common/test/customRender';
import ProfileChildAccordionItem from '../ProfileChildAccordionItem';
import { childByIdQuery } from '../../../../child/queries/ChildQueries';
import * as ProfileContextModule from '../../../hooks/useProfileContext';

vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client')>();
  return {
    ...actual,
    useQuery: vi.fn(actual.useQuery),
  };
});

vi.mock('../modal/ProfileChildDetailEditModal', () => ({
  default: ({ setIsOpen }: { setIsOpen: (v: boolean) => void }) => (
    <div data-testid="child-edit-modal">
      <button onClick={() => setIsOpen(false)}>Close child modal</button>
    </div>
  ),
}));

vi.mock('../ProfileEnrolledEventCard', () => ({
  default: ({ enrolment }: { enrolment: { id: string } }) => (
    <div data-testid={`enrolled-card-${enrolment.id}`}>Enrolled Event</div>
  ),
}));

const mockChild = {
  __typename: 'ChildNode' as const,
  id: 'child-1',
  name: 'Elias',
  birthyear: 2024,
  postalCode: '00100',
  project: {
    __typename: 'ProjectNode' as const,
    id: 'project-1',
    name: 'Test Project',
    year: 2024,
  },
  relationships: {
    __typename: 'RelationshipNodeConnection' as const,
    edges: [],
  },
  upcomingEventsAndEventGroups: {
    __typename: 'EventOrEventGroupConnection' as const,
    edges: [],
  },
  occurrences: {
    __typename: 'OccurrenceNodeConnection' as const,
    edges: [],
  },
  enrolments: {
    __typename: 'EnrolmentNodeConnection' as const,
    edges: [],
  },
};

const mockChildByIdData = {
  __typename: 'ChildNode' as const,
  id: 'child-1',
  name: 'Elias',
  birthyear: 2024,
  postalCode: '00100',
  project: {
    __typename: 'ProjectNode' as const,
    id: 'project-1',
    name: 'Test Project',
    year: 2024,
  },
  relationships: {
    __typename: 'RelationshipNodeConnection' as const,
    edges: [],
  },
  activeInternalAndTicketSystemEnrolments: {
    __typename: 'InternalOrTicketSystemEnrolmentConnection' as const,
    edges: [
      {
        __typename: 'InternalOrTicketSystemEnrolmentEdge' as const,
        node: {
          __typename: 'EnrolmentNode' as const,
          id: 'enrol-1',
          referenceId: 'ref-1',
          occurrence: {
            __typename: 'OccurrenceNode' as const,
            id: 'occ-1',
            time: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            venue: {
              __typename: 'VenueNode' as const,
              id: 'v-1',
              name: 'Annantalo',
              address: 'Annankatu 30',
            },
            event: {
              __typename: 'EventNode' as const,
              id: 'ev-1',
              name: 'Taidepaja',
              shortDescription: 'Kuvaus',
              duration: 60,
              image: null,
              imageAltText: null,
              participantsPerInvite: 'FAMILY' as any,
              eventGroup: {
                __typename: 'EventGroupNode' as const,
                id: 'eg-1',
                name: 'Syksy 2026',
                publishedAt: '2026-08-01T10:00:00.000Z',
              },
            },
          },
        },
      },
    ],
  },
  upcomingEventsAndEventGroups: {
    __typename: 'EventOrEventGroupConnection' as const,
    edges: [],
  },
  pastEvents: {
    __typename: 'EventConnection' as const,
    edges: [
      {
        __typename: 'EventEdge' as const,
        node: {
          __typename: 'EventNode' as const,
          id: 'past-ev-1',
          name: 'Menneen taidepaja',
          shortDescription: 'Menneen kuvaus',
          duration: 60,
          image: null,
          imageAltText: null,
          participantsPerInvite: 'FAMILY' as any,
          occurrences: {
            __typename: 'OccurrenceNodeConnection' as const,
            edges: [
              {
                __typename: 'OccurrenceNodeEdge' as const,
                node: {
                  __typename: 'OccurrenceNode' as const,
                  id: 'past-occ-1',
                  time: '2025-05-10T10:00:00.000Z',
                },
              },
            ],
          },
        },
      },
    ],
  },
};

const childByIdMock = {
  request: {
    query: childByIdQuery,
    variables: { id: 'child-1' },
  },
  result: {
    data: { child: mockChildByIdData },
  },
};

describe('ProfileChildAccordionItem', () => {
  beforeEach(() => {
    vi.spyOn(ProfileContextModule, 'useProfileContext').mockReturnValue({
      profile: null,
      refetchProfile: vi.fn(),
      clearProfile: vi.fn(),
      updateProfile: vi.fn(),
      isLoading: false,
      isFetchCalled: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders child identity info, enrolled event card, and past events links when child has active future enrolment', async () => {
    render(
      <ProfileChildAccordionItem child={mockChild} initiallyOpen={true} />,
      [childByIdMock]
    );

    // Accordion heading
    expect(
      screen.getByRole('heading', { level: 3, name: 'Elias' })
    ).toBeInTheDocument();

    // Left column identity
    await waitFor(() => {
      expect(screen.getByText('Teemapolku: –')).toBeInTheDocument();
    });

    const editBtn = screen.getByRole('button', {
      name: /muokkaa lapsen elias tietoja/i,
    });
    expect(editBtn).toBeInTheDocument();
    expect(editBtn).toHaveAttribute('aria-haspopup', 'dialog');

    // Event group heading and enrolled event card are displayed
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 5, name: 'Syksy 2026' })
      ).toBeInTheDocument();
      expect(screen.getByTestId('enrolled-card-enrol-1')).toBeInTheDocument();
    });

    // Search prompt and not started note are NOT shown when child is already enrolled
    expect(
      screen.queryByRole('link', { name: /etsi tapahtumia/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Ilmoittautuminen tapahtumiin alkaa myöhemmin.')
    ).not.toBeInTheDocument();

    // Expand past events accordion
    const user = userEvent.setup();
    const pastAccordionBtn = screen.getByRole('button', {
      name: 'Menneet tapahtumat',
    });
    await user.click(pastAccordionBtn);

    // Past events link
    expect(
      screen.getByRole('link', { name: /Menneen taidepaja/i })
    ).toHaveAttribute(
      'href',
      '/profile/child/child-1/event/past-ev-1/past'
    );
  });

  it('renders event group heading, "Ilmoittautuminen kauden tapahtumiin on alkanut!" and search button when child has a published event group with events', async () => {
    const activeEnrolingMock = {
      request: {
        query: childByIdQuery,
        variables: { id: 'child-1' },
      },
      result: {
        data: {
          child: {
            ...mockChildByIdData,
            activeInternalAndTicketSystemEnrolments: {
              __typename: 'InternalOrTicketSystemEnrolmentConnection' as const,
              edges: [],
            },
            upcomingEventsAndEventGroups: {
              __typename: 'EventOrEventGroupConnection' as const,
              edges: [
                {
                  __typename: 'EventOrEventGroupEdge' as const,
                  node: {
                    __typename: 'EventGroupNode' as const,
                    id: 'eg-spring-1',
                    name: 'Kevät 2026',
                    shortDescription: 'Kevään tapahtumat',
                    image: '',
                    imageAltText: null,
                    publishedAt: '2026-01-15T10:00:00.000Z',
                    canChildEnroll: true,
                    events: {
                      __typename: 'EventNodeConnection' as const,
                      edges: [
                        {
                          __typename: 'EventNodeEdge' as const,
                          node: {
                            __typename: 'EventNode' as const,
                            id: 'upcoming-ev-1',
                            name: 'Kevään teatteri',
                            publishedAt: '2026-01-15T10:00:00.000Z',
                            canChildEnroll: true,
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

    render(
      <ProfileChildAccordionItem child={mockChild} initiallyOpen={true} />,
      [activeEnrolingMock]
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 5, name: 'Kevät 2026' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Ilmoittautuminen kauden tapahtumiin on alkanut!')
      ).toBeInTheDocument();
    });

    const searchLink = screen.getByRole('link', {
      name: /etsi tapahtumia/i,
    });
    expect(searchLink).toHaveAttribute(
      'href',
      '/profile/child/child-1/events'
    );
    expect(
      screen.queryByText('Ilmoittautuminen tapahtumiin alkaa myöhemmin.')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('enrolled-card-enrol-1')
    ).not.toBeInTheDocument();
  });

  it('does not show "Etsi tapahtumia" button when there are only standalone published events without any event group', async () => {
    const standaloneEventsOnlyMock = {
      request: {
        query: childByIdQuery,
        variables: { id: 'child-1' },
      },
      result: {
        data: {
          child: {
            ...mockChildByIdData,
            activeInternalAndTicketSystemEnrolments: { edges: [] },
            upcomingEventsAndEventGroups: {
              edges: [
                {
                  node: {
                    __typename: 'EventNode' as const,
                    id: 'upcoming-ev-1',
                    name: 'Syksyn tanssi',
                    shortDescription: 'Tanssityöpaja',
                    image: null,
                    imageAltText: null,
                    participantsPerInvite: 'FAMILY' as any,
                    canChildEnroll: true,
                  },
                },
              ],
            },
          },
        },
      },
    };

    render(
      <ProfileChildAccordionItem child={mockChild} initiallyOpen={true} />,
      [standaloneEventsOnlyMock]
    );

    await waitFor(() => {
      expect(
        screen.getByText('Ilmoittautuminen tapahtumiin alkaa myöhemmin.')
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText('Ilmoittautuminen kauden tapahtumiin on alkanut!')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /etsi tapahtumia/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('enrolled-card-enrol-1')
    ).not.toBeInTheDocument();
  });

  it('does not render event groups that are not published yet or do not have any published events', async () => {
    const unpublishedAndEmptyGroupsMock = {
      request: {
        query: childByIdQuery,
        variables: { id: 'child-1' },
      },
      result: {
        data: {
          child: {
            ...mockChildByIdData,
            activeInternalAndTicketSystemEnrolments: { edges: [] },
            upcomingEventsAndEventGroups: {
              __typename: 'EventOrEventGroupConnection' as const,
              edges: [
                {
                  __typename: 'EventOrEventGroupEdge' as const,
                  node: {
                    __typename: 'EventGroupNode' as const,
                    id: 'eg-unpublished',
                    name: 'Julkaisematon kausi',
                    shortDescription: null,
                    image: '',
                    imageAltText: null,
                    publishedAt: null,
                    canChildEnroll: false,
                    events: {
                      __typename: 'EventNodeConnection' as const,
                      edges: [
                        {
                          __typename: 'EventNodeEdge' as const,
                          node: {
                            __typename: 'EventNode' as const,
                            id: 'ev-in-unpub',
                            name: 'Tapahtuma',
                            publishedAt: '2026-08-01T10:00:00.000Z',
                            canChildEnroll: false,
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  __typename: 'EventOrEventGroupEdge' as const,
                  node: {
                    __typename: 'EventGroupNode' as const,
                    id: 'eg-empty',
                    name: 'Tyhjä kausi',
                    shortDescription: null,
                    image: '',
                    imageAltText: null,
                    publishedAt: '2026-08-01T10:00:00.000Z',
                    canChildEnroll: true,
                    events: {
                      __typename: 'EventNodeConnection' as const,
                      edges: [],
                    },
                  },
                },
              ],
            },
          },
        },
      },
    };

    render(
      <ProfileChildAccordionItem child={mockChild} initiallyOpen={true} />,
      [unpublishedAndEmptyGroupsMock]
    );

    await waitFor(() => {
      expect(
        screen.getByText('Ilmoittautuminen tapahtumiin alkaa myöhemmin.')
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole('heading', { name: 'Julkaisematon kausi' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Tyhjä kausi' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /etsi tapahtumia/i })
    ).not.toBeInTheDocument();
  });

  it('renders "Ilmoittautuminen tapahtumiin alkaa myöhemmin." note when there are no available events at all', async () => {
    const noEventsMock = {
      request: {
        query: childByIdQuery,
        variables: { id: 'child-1' },
      },
      result: {
        data: {
          child: {
            ...mockChildByIdData,
            activeInternalAndTicketSystemEnrolments: { edges: [] },
            upcomingEventsAndEventGroups: { edges: [] },
          },
        },
      },
    };

    render(
      <ProfileChildAccordionItem child={mockChild} initiallyOpen={true} />,
      [noEventsMock]
    );

    await waitFor(() => {
      expect(
        screen.getByText('Ilmoittautuminen tapahtumiin alkaa myöhemmin.')
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText('Ilmoittautuminen kauden tapahtumiin on alkanut!')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /etsi tapahtumia/i })
    ).not.toBeInTheDocument();
  });

  it('renders both enrolled event group box AND open event group search prompt box when child has multiple published event groups', async () => {
    const enrolledWithSecondGroupMock = {
      request: {
        query: childByIdQuery,
        variables: { id: 'child-1' },
      },
      result: {
        data: {
          child: {
            ...mockChildByIdData,
            upcomingEventsAndEventGroups: {
              __typename: 'EventOrEventGroupConnection' as const,
              edges: [
                {
                  __typename: 'EventOrEventGroupEdge' as const,
                  node: {
                    __typename: 'EventGroupNode' as const,
                    id: 'eg-1',
                    name: 'Syksy 2026',
                    shortDescription: null,
                    image: '',
                    imageAltText: null,
                    publishedAt: '2026-08-01T10:00:00.000Z',
                    canChildEnroll: false,
                    events: {
                      __typename: 'EventNodeConnection' as const,
                      edges: [
                        {
                          __typename: 'EventNodeEdge' as const,
                          node: {
                            __typename: 'EventNode' as const,
                            id: 'ev-1',
                            name: 'Taidepaja',
                            publishedAt: '2026-08-01T10:00:00.000Z',
                            canChildEnroll: false,
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  __typename: 'EventOrEventGroupEdge' as const,
                  node: {
                    __typename: 'EventGroupNode' as const,
                    id: 'eg-2',
                    name: 'Syksy 2026',
                    shortDescription: null,
                    image: '',
                    imageAltText: null,
                    publishedAt: '2026-08-15T10:00:00.000Z',
                    canChildEnroll: true,
                    events: {
                      __typename: 'EventNodeConnection' as const,
                      edges: [
                        {
                          __typename: 'EventNodeEdge' as const,
                          node: {
                            __typename: 'EventNode' as const,
                            id: 'upcoming-ev-2',
                            name: 'Toinen työpaja',
                            publishedAt: '2026-08-15T10:00:00.000Z',
                            canChildEnroll: true,
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

    render(
      <ProfileChildAccordionItem child={mockChild} initiallyOpen={true} />,
      [enrolledWithSecondGroupMock]
    );

    await waitFor(() => {
      expect(
        screen.getAllByRole('heading', { level: 5, name: 'Syksy 2026' })
      ).toHaveLength(2);
      expect(screen.getByTestId('enrolled-card-enrol-1')).toBeInTheDocument();
      expect(
        screen.getByText('Ilmoittautuminen kauden tapahtumiin on alkanut!')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /etsi tapahtumia/i })
      ).toBeInTheDocument();
    });
  });

  it('does not treat past occurrence as future enrolment and falls back to active enrolling check', async () => {
    const pastEnrolmentOccurrenceMock = {
      request: {
        query: childByIdQuery,
        variables: { id: 'child-1' },
      },
      result: {
        data: {
          child: {
            ...mockChildByIdData,
            activeInternalAndTicketSystemEnrolments: {
              __typename: 'InternalOrTicketSystemEnrolmentConnection' as const,
              edges: [
                {
                  __typename: 'InternalOrTicketSystemEnrolmentEdge' as const,
                  node: {
                    __typename: 'EnrolmentNode' as const,
                    id: 'enrol-past',
                    referenceId: 'ref-past',
                    occurrence: {
                      __typename: 'OccurrenceNode' as const,
                      id: 'occ-past',
                      time: '2020-01-01T10:00:00.000Z', // Definitely in the past
                      venue: {
                        __typename: 'VenueNode' as const,
                        id: 'v-1',
                        name: 'Annantalo',
                        address: 'Annankatu 30',
                      },
                      event: {
                        __typename: 'EventNode' as const,
                        id: 'ev-past',
                        name: 'Vanha työpaja',
                        shortDescription: 'Kuvaus',
                        duration: 60,
                        image: null,
                        imageAltText: null,
                        participantsPerInvite: 'FAMILY' as any,
                        eventGroup: null,
                      },
                    },
                  },
                },
              ],
            },
            upcomingEventsAndEventGroups: {
              __typename: 'EventOrEventGroupConnection' as const,
              edges: [
                {
                  __typename: 'EventOrEventGroupEdge' as const,
                  node: {
                    __typename: 'EventGroupNode' as const,
                    id: 'eg-open-1',
                    name: 'Kevät 2026',
                    shortDescription: 'Kuvaus',
                    image: '',
                    imageAltText: null,
                    publishedAt: '2026-01-10T10:00:00.000Z',
                    canChildEnroll: true,
                    events: {
                      __typename: 'EventNodeConnection' as const,
                      edges: [
                        {
                          __typename: 'EventNodeEdge' as const,
                          node: {
                            __typename: 'EventNode' as const,
                            id: 'upcoming-ev-1',
                            name: 'Kevään teatteri',
                            publishedAt: '2026-01-10T10:00:00.000Z',
                            canChildEnroll: true,
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

    render(
      <ProfileChildAccordionItem child={mockChild} initiallyOpen={true} />,
      [pastEnrolmentOccurrenceMock]
    );

    // The past enrolment card should NOT be shown in the future events section
    await waitFor(() => {
      expect(
        screen.getByText('Ilmoittautuminen kauden tapahtumiin on alkanut!')
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByTestId('enrolled-card-enrol-past')
    ).not.toBeInTheDocument();
  });

  it('opens child edit modal when edit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ProfileChildAccordionItem child={mockChild} initiallyOpen={true} />,
      [childByIdMock]
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /muokkaa lapsen elias tietoja/i })
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', { name: /muokkaa lapsen elias tietoja/i })
    );

    expect(screen.getByTestId('child-edit-modal')).toBeInTheDocument();
  });

  it('renders empty past events text when pastEvents is empty', async () => {
    const emptyPastMock = {
      request: {
        query: childByIdQuery,
        variables: { id: 'child-1' },
      },
      result: {
        data: {
          child: {
            ...mockChildByIdData,
            pastEvents: { edges: [] },
          },
        },
      },
    };

    render(
      <ProfileChildAccordionItem child={mockChild} initiallyOpen={true} />,
      [emptyPastMock]
    );

    await waitFor(() => {
      expect(screen.getByText('Teemapolku: –')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const pastAccordionBtn = screen.getByRole('button', {
      name: 'Menneet tapahtumat',
    });
    await user.click(pastAccordionBtn);

    expect(screen.getByText('Ei menneitä tapahtumia')).toBeInTheDocument();
  });
});
