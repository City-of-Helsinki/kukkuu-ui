import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import EventDetailsPage, {
  EventDetailsPageOccurrence,
  EventDetailsPageProps,
} from '../EventDetailsPage';
import {
  EventParticipantsPerInvite,
  TicketSystem,
} from '../../../api/generatedTypes/graphql';
import { eventExternalTicketSystemHasAnyFreePasswordsQuery } from '../../queries/eventQuery';

vi.mock('../../getTicketSystemPasswordRefetchQueries', () => ({
  default: vi.fn(() => []),
}));

const mockOccurrences: EventDetailsPageOccurrence[] = [
  {
    id: 'occ-1',
    time: '2026-09-14T15:30:00Z',
    remainingCapacity: 20,
    occurrenceLanguage: 'FI',
    venue: {
      id: 'venue-1',
      name: 'Musiikkitalo',
      address: 'Mannerheimintie 13 A',
    },
  },
];

const mockFreePasswordsQuery = {
  request: {
    query: eventExternalTicketSystemHasAnyFreePasswordsQuery,
    variables: { id: 'ext-event-1' },
  },
  result: {
    data: {
      event: {
        __typename: 'EventNode',
        id: 'ext-event-1',
        ticketSystem: {
          __typename: 'TicketmasterEventTicketSystem',
          type: TicketSystem.Ticketmaster,
          hasAnyFreePasswords: true,
        },
      },
    },
  },
};

describe('EventDetailsPage', () => {
  it('renders occurrences table section for internal events', () => {
    const internalEvent: EventDetailsPageProps['event'] = {
      id: 'int-event-1',
      name: 'Sisäinen tapahtuma',
      shortDescription: 'Kuvaus',
      description: '<p>Tarkempi kuvaus</p>',
      duration: 60,
      capacityPerOccurrence: 30,
      participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
      ticketSystem: null,
    };

    render(
      <EventDetailsPage
        event={internalEvent}
        allOccurrences={mockOccurrences}
        childId="child-1"
      />
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Sisäinen tapahtuma' })
    ).toBeInTheDocument();
    // Occurrence table is rendered
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /tapahtuman ajankohdat/i,
      })
    ).toBeInTheDocument();
  });

  it('renders ticket system section for external ticket system events', async () => {
    const externalEvent: EventDetailsPageProps['event'] = {
      id: 'ext-event-1',
      name: 'Ulkoinen Lippupiste-tapahtuma',
      shortDescription: 'Kuvaus',
      description: '<p>Tarkempi kuvaus</p>',
      duration: 60,
      capacityPerOccurrence: 30,
      participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
      ticketSystem: {
        type: TicketSystem.Lippupiste,
        childPassword: null,
        url: 'https://lippu.fi/event/123',
      },
    };

    render(
      <EventDetailsPage
        event={externalEvent}
        allOccurrences={[]}
        childId="child-1"
      />,
      [mockFreePasswordsQuery]
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Ulkoinen Lippupiste-tapahtuma',
      })
    ).toBeInTheDocument();
    // Ticket system section is rendered instead of occurrences table
    expect(
      screen.getByRole('heading', { level: 2, name: /ilmoittaudu tapahtumaan/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        level: 2,
        name: /tapahtuman ajankohdat/i,
      })
    ).not.toBeInTheDocument();
  });
});
