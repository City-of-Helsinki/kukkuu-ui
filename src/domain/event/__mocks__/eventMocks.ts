import { MockedResponse } from '@apollo/client/testing';

import eventQuery, {
  eventExternalTicketSystemHasAnyFreePasswordsQuery,
} from '../queries/eventQuery';

export const testEventId = 'event-456';
export const testChildId = 'child-123';

export const eventWithOccurrencesMock: MockedResponse = {
  request: {
    query: eventQuery,
    variables: {
      id: testEventId,
      childId: testChildId,
    },
  },
  newData: () => ({
    data: {
      event: {
        __typename: 'EventNode',
        id: testEventId,
        name: 'Test Event',
        description: 'Test event description',
        shortDescription: 'Test short description',
        image: 'test-image-url',
        imageAltText: 'Test image alt',
        participantsPerInvite: 'CHILD_AND_GUARDIAN',
        duration: 60,
        capacityPerOccurrence: 20,
        canChildEnroll: true,
        eventGroup: {
          __typename: 'EventGroupNode',
          id: 'group-123',
        },
        ticketSystem: {
          __typename: 'InternalEventTicketSystem',
          type: 'INTERNAL',
        },
        allOccurrences: {
          __typename: 'OccurrenceNodeConnection',
          edges: [],
        },
        occurrences: {
          __typename: 'OccurrenceNodeConnection',
          edges: [],
        },
      },
    },
  }),
};

export const externalTicketSystemEventMock: MockedResponse = {
  request: {
    query: eventQuery,
    variables: {
      id: testEventId,
      childId: testChildId,
    },
  },
  newData: () => ({
    data: {
      event: {
        __typename: 'EventNode',
        id: testEventId,
        name: 'External Ticket Event',
        description: 'Event with external ticket system',
        shortDescription: 'External short description',
        image: 'external-image-url',
        imageAltText: 'External image alt',
        participantsPerInvite: 'CHILD_AND_GUARDIAN',
        duration: 60,
        capacityPerOccurrence: 20,
        canChildEnroll: true,
        eventGroup: {
          __typename: 'EventGroupNode',
          id: 'group-123',
        },
        ticketSystem: {
          __typename: 'TicketmasterEventTicketSystem',
          type: 'TICKETMASTER',
          childPassword: 'test-password',
          url: 'https://ticketmaster.example',
        },
        allOccurrences: {
          __typename: 'OccurrenceNodeConnection',
          edges: [],
        },
        occurrences: {
          __typename: 'OccurrenceNodeConnection',
          edges: [],
        },
      },
    },
  }),
};

export const internalTicketSystemPasswordsMock: MockedResponse = {
  request: {
    query: eventExternalTicketSystemHasAnyFreePasswordsQuery,
    variables: {
      id: testEventId,
    },
  },
  newData: () => ({
    data: {
      event: {
        __typename: 'EventNode',
        id: testEventId,
        ticketSystem: {
          __typename: 'InternalEventTicketSystem',
          type: 'INTERNAL',
        },
      },
    },
  }),
};

export const hasFreePasswordsMock: MockedResponse = {
  request: {
    query: eventExternalTicketSystemHasAnyFreePasswordsQuery,
    variables: {
      id: testEventId,
    },
  },
  newData: () => ({
    data: {
      event: {
        __typename: 'EventNode',
        id: testEventId,
        ticketSystem: {
          __typename: 'TicketmasterEventTicketSystem',
          type: 'TICKETMASTER',
          hasAnyFreePasswords: true,
        },
      },
    },
  }),
};

export const dummyPasswordMock: MockedResponse = {
  request: {
    query: eventExternalTicketSystemHasAnyFreePasswordsQuery,
    variables: {
      id: testEventId,
    },
  },
  result: {
    data: {
      event: {
        __typename: 'EventNode',
        id: testEventId,
        ticketSystem: null,
      },
    },
  },
};
