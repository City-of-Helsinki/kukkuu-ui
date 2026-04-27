import { MockedResponse } from '@apollo/client/testing';

import occurrenceQuery from '../queries/occurrenceQuery';
import { testChildId } from '../../child/__mocks__/childMocks';

export const testOccurrenceId = 'occurrence-789';
export const testOccurrenceEventId = 'event-456';

export const occurrenceData = {
  __typename: 'OccurrenceNode' as const,
  id: testOccurrenceId,
  time: '2025-05-15T10:00:00+00:00',
  remainingCapacity: 10,
  event: {
    __typename: 'EventNode' as const,
    id: testOccurrenceEventId,
    image: 'image-url',
    imageAltText: 'Test Event Image',
    description: 'Test Event Description',
    shortDescription: 'Test Short Description',
    name: 'Test Event',
    duration: 60,
    participantsPerInvite: 1,
    eventGroup: {
      __typename: 'EventGroupNode' as const,
      id: 'group-123',
    },
  },
  venue: {
    __typename: 'VenueNode' as const,
    id: 'venue-123',
    name: 'Test Venue',
    address: 'Test Address 123',
    accessibilityInfo: 'Accessible',
    arrivalInstructions: 'Come early',
    additionalInfo: 'Extra info',
    wwwUrl: 'https://example.com',
    wcAndFacilities: 'Has facilities',
  },
  childHasFreeSpotNotificationSubscription: false,
};

export const occurrenceWithDataMock: MockedResponse = {
  request: {
    query: occurrenceQuery,
    variables: {
      id: testOccurrenceId,
      childId: testChildId,
    },
  },
  result: {
    data: {
      occurrence: occurrenceData,
    },
  },
};
