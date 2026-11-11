import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { PageDocument } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import { customRender as render } from '../../../../common/test/customRender';
import { fakePage } from '../../../../utils/cmsMockDataUtils';
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
      name: 'Music Centre',
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
      name: 'Internal event',
      shortDescription: 'Description',
      description: '<p>Detailed description</p>',
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
      screen.getByRole('heading', { level: 1, name: 'Internal event' })
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
      name: 'External Lippupiste event',
      shortDescription: 'Description',
      description: '<p>Detailed description</p>',
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
        name: 'External Lippupiste event',
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

  it('uses CMS search page breadcrumbs when available and preserves child query param', async () => {
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

    const cmsSearchPage = fakePage({
      title: 'Löydä tapahtumia CMS',
      breadcrumbs: [
        {
          title: 'Etusivu CMS',
          uri: '/fi/',
          __typename: 'Breadcrumb',
        },
        {
          title: 'Löydä tapahtumia CMS',
          uri: '/fi/search/',
          __typename: 'Breadcrumb',
        },
      ],
    });

    render(
      <EventDetailsPage
        event={internalEvent}
        allOccurrences={mockOccurrences}
        childId="child-1"
      />,
      [
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
      ]
    );

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: 'Löydä tapahtumia CMS' })
      ).toHaveAttribute('href', '/events?child=child-1');
    });
  });
});
