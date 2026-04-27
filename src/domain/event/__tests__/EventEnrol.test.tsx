import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import { customRender as render } from '../../../common/test/customRender';
import EventEnrol from '../EventEnrol';
import { EventParticipantsPerInvite, EventQuery, TicketSystem } from '../../api/generatedTypes/graphql';
import type { EventEnrolProps } from '../EventEnrol';

const baseEvent: EventQuery["event"] = {
  __typename: 'EventNode',
  id: 'event-1',
  name: 'Test Event',
  description: 'Description',
  shortDescription: null,
  image: '',
  imageAltText: null,
  participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
  duration: 60,
  capacityPerOccurrence: 10,
  canChildEnroll: true,
  eventGroup: null,
  ticketSystem: {
    __typename: 'InternalEventTicketSystem',
    type: TicketSystem.Internal,
  },
  occurrences: {
    __typename: 'OccurrenceNodeConnection',
    edges: [],
  },
  allOccurrences: {
    __typename: 'OccurrenceNodeConnection',
    edges: [],
  },
};

const occurrenceEdge = {
  __typename: 'OccurrenceNodeEdge' as const,
  node: {
    __typename: 'OccurrenceNode' as const,
    id: 'occurrence-1',
    time: '2024-06-01T10:00:00+00:00',
    remainingCapacity: 5,
    childHasFreeSpotNotificationSubscription: false,
    event: { __typename: 'EventNode' as const, id: 'event-1', name: 'Test Event', duration: 60 },
    venue: {
      __typename: 'VenueNode' as const,
      id: 'venue-1',
      name: 'Musiikkitalo',
      address: 'Mannerheimintie 13A',
    },
    ticketSystem: {
      __typename: 'InternalOccurrenceTicketSystem' as const,
      type: TicketSystem.Internal,
    },
  },
};

const defaultProps: EventEnrolProps = {
  data: { event: baseEvent },
  filterValues: {},
  options: { dates: [], times: [] },
  onFilterUpdate: vi.fn(),
};

const renderEnrol = (props: Partial<EventEnrolProps> = {}) =>
  render(<EventEnrol {...defaultProps} {...props} />);

describe('EventEnrol', () => {
  it('renders nothing meaningful when event data is missing', () => {
    const { container } = renderEnrol({ data: { event: null } });

    expect(container.querySelector('h2')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Valitse päivämäärä/i)).not.toBeInTheDocument();
  });

  it('renders the enrollment heading', () => {
    renderEnrol();

    expect(screen.getByRole('heading', { name: /Ilmoittaudu/i })).toBeInTheDocument();
  });

  it('renders the date dropdown', () => {
    renderEnrol();

    expect(screen.getByLabelText(/Valitse päivämäärä/i)).toBeInTheDocument();
  });

  it('renders the time dropdown', () => {
    renderEnrol();

    expect(screen.getByLabelText(/Valitse kellonaika/i)).toBeInTheDocument();
  });

  it('shows can-not-enroll notification when canChildEnroll is false', () => {
    renderEnrol({
      data: { event: { ...baseEvent, canChildEnroll: false } },
    });

    expect(
      screen.getByText(/Huomioithan, että et voi ilmoittautua tähän tapahtumaan/i)
    ).toBeInTheDocument();
  });

  it('does not show can-not-enroll notification when canChildEnroll is true', () => {
    renderEnrol();

    expect(
      screen.queryByText(/Huomioithan, että et voi ilmoittautua tähän tapahtumaan/i)
    ).not.toBeInTheDocument();
  });

  it('renders the occurrence list when occurrences are present', () => {
    renderEnrol({
      data: {
        event: {
          ...baseEvent,
          occurrences: {
            __typename: 'OccurrenceNodeConnection',
            edges: [occurrenceEdge],
          },
        },
      },
    });

    expect(screen.getAllByText('Musiikkitalo').length).toBeGreaterThan(0);
  });

  it('shows free places column for internal ticket system', () => {
    renderEnrol({
      data: {
        event: {
          ...baseEvent,
          occurrences: {
            __typename: 'OccurrenceNodeConnection',
            edges: [occurrenceEdge],
          },
        },
      },
    });

    expect(screen.getAllByText(/Vapaat paikat/i).length).toBeGreaterThan(0);
  });

  it('does not show free places column for external ticket system', () => {
    renderEnrol({
      data: {
        event: {
          ...baseEvent,
          ticketSystem: {
            __typename: 'TicketmasterEventTicketSystem' as const,
            type: TicketSystem.Ticketmaster,
            childPassword: null,
            url: 'https://ticketmaster.fi',
          },
          occurrences: {
            __typename: 'OccurrenceNodeConnection',
            edges: [occurrenceEdge],
          },
        },
      },
    });

    expect(screen.queryByText(/Vapaat paikat/i)).not.toBeInTheDocument();
  });

  it('renders the date dropdown with options passed as props', () => {
    const dates = [
      { key: '1', label: '1.6.2024', value: '2024-06-01' },
      { key: '2', label: '2.6.2024', value: '2024-06-02' },
    ];

    renderEnrol({ options: { dates, times: [] } });

    // Dropdown is rendered (HDS Select does not expand options into DOM until opened)
    expect(screen.getByLabelText(/Valitse päivämäärä/i)).toBeInTheDocument();
  });
});
