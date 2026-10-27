import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';

import { customRender as render } from '../../../../common/test/customRender';
import EventTicketSystemSection from '../EventTicketSystemSection';
import {
  EnrolmentDeniedReason,
  EventParticipantsPerInvite,
  TicketSystem,
} from '../../../api/generatedTypes/graphql';
import { eventExternalTicketSystemHasAnyFreePasswordsQuery } from '../../queries/eventQuery';
import assignTicketSystemPasswordMutation from '../../mutations/assignTicketSystemPasswordMutation';

vi.mock('../../getTicketSystemPasswordRefetchQueries', () => ({
  default: vi.fn(() => []),
}));

const mockEvent = {
  id: 'event-1',
  name: 'Musiikkiseikkailu',
  enrolmentDeniedReason: null,
  registrationOpensAt: null,
  participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
  ticketSystem: {
    type: TicketSystem.Ticketmaster,
    childPassword: null,
    url: 'https://ticketmaster.fi/event/123',
  },
};

const freePasswordsMock = (hasAnyFreePasswords = true) => ({
  request: {
    query: eventExternalTicketSystemHasAnyFreePasswordsQuery,
    variables: { id: 'event-1' },
  },
  result: {
    data: {
      event: {
        __typename: 'EventNode',
        id: 'event-1',
        ticketSystem: {
          __typename: 'TicketmasterEventTicketSystem',
          type: TicketSystem.Ticketmaster,
          hasAnyFreePasswords,
        },
      },
    },
  },
});

const assignMutationMock = {
  request: {
    query: assignTicketSystemPasswordMutation,
    variables: {
      input: {
        eventId: 'event-1',
        childId: 'child-1',
        clientMutationId: null,
      },
    },
  },
  result: {
    data: {
      assignTicketSystemPassword: {
        __typename: 'AssignTicketSystemPasswordMutationPayload',
        password: 'NEW-PASSWORD-123',
      },
    },
  },
};

describe('EventTicketSystemSection', () => {
  it('renders pre-acquisition card with claim button when child has no password and free passwords exist', async () => {
    render(
      <EventTicketSystemSection event={mockEvent} childId="child-1" />,
      [freePasswordsMock(true)]
    );

    expect(screen.getByText('Ilmoittaudu tapahtumaan')).toBeInTheDocument();
    expect(screen.getByText('Henkilökohtainen salasana')).toBeInTheDocument();

    const claimButton = await screen.findByRole('button', {
      name: 'Kyllä, lunastan salasanan!',
    });
    expect(claimButton).toBeInTheDocument();
  });

  it('renders no free passwords notice when hasFreePasswords is false', async () => {
    render(
      <EventTicketSystemSection event={mockEvent} childId="child-1" />,
      [freePasswordsMock(false)]
    );

    expect(
      await screen.findByText('Valitettavasti salasanoja ei ole enää jäljellä')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Kyllä, lunastan salasanan!' })
    ).not.toBeInTheDocument();
  });

  it('claims password on button click and immediately reveals the password and external service button', async () => {
    const user = userEvent.setup();

    render(
      <EventTicketSystemSection event={mockEvent} childId="child-1" />,
      [freePasswordsMock(true), assignMutationMock]
    );

    const claimButton = await screen.findByRole('button', {
      name: 'Kyllä, lunastan salasanan!',
    });
    await user.click(claimButton);

    expect(
      await screen.findByTestId('ticket-system-password-card')
    ).toBeInTheDocument();
    expect(screen.getByText('NEW-PASSWORD-123')).toBeInTheDocument();

    const continueLink = screen.getByRole('link', {
      name: /Jatka ulkoiseen lipunmyyntipalveluun/i,
    });
    expect(continueLink).toHaveAttribute(
      'href',
      'https://ticketmaster.fi/event/123'
    );
  });

  it('renders password directly when child already has a password', () => {
    const eventWithPassword = {
      ...mockEvent,
      ticketSystem: {
        ...mockEvent.ticketSystem,
        childPassword: 'EXISTING-PASS-999',
      },
    };

    render(
      <EventTicketSystemSection event={eventWithPassword} childId="child-1" />,
      []
    );

    expect(screen.getByText('EXISTING-PASS-999')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /Jatka ulkoiseen lipunmyyntipalveluun/i,
      })
    ).toBeInTheDocument();
  });

  it('renders alert notification when enrolmentDeniedReason is set', () => {
    const deniedEvent = {
      ...mockEvent,
      enrolmentDeniedReason: EnrolmentDeniedReason.AlreadyHasPasswordToEvent,
    };

    render(
      <EventTicketSystemSection event={deniedEvent} childId="child-1" />,
      []
    );

    expect(
      screen.getByText('Huomioithan, että et voi ilmoittautua tähän tapahtumaan.')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Kyllä, lunastan salasanan!' })
    ).not.toBeInTheDocument();
  });

  it('displays error notification when claiming password fails with NO_FREE_TICKET_SYSTEM_PASSWORDS_ERROR', async () => {
    const user = userEvent.setup();
    const errorMutationMock = {
      request: {
        query: assignTicketSystemPasswordMutation,
        variables: {
          input: {
            eventId: 'event-1',
            childId: 'child-1',
            clientMutationId: null,
          },
        },
      },
      result: {
        errors: [
          new GraphQLError('No free passwords', {
            extensions: { code: 'NO_FREE_TICKET_SYSTEM_PASSWORDS_ERROR' },
          }),
        ],
      },
    };

    render(
      <EventTicketSystemSection event={mockEvent} childId="child-1" />,
      [freePasswordsMock(true), errorMutationMock]
    );

    const claimButton = await screen.findByRole('button', {
      name: 'Kyllä, lunastan salasanan!',
    });
    await user.click(claimButton);

    expect(
      await screen.findByText(/Valitettavasti salasanoja ei ole enää jäljellä/i)
    ).toBeInTheDocument();
  });
});
