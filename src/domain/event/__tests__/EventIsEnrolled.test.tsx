import { MockedResponse } from '@apollo/client/testing';
import { screen } from '@testing-library/react';
import range from 'lodash/range';

import { customRender as render } from '../../../common/test/customRender';
import EventIsEnrolled from '../EventIsEnrolled';
import occurrenceQuery from '../queries/occurrenceQuery';
import {
  EventParticipantsPerInvite,
  OccurrenceQuery,
} from '../../api/generatedTypes/graphql';
import AppConfig from '../../app/AppConfig';

const emptyOccurrenceMock: MockedResponse = {
  request: {
    query: occurrenceQuery,
    variables: { id: undefined, childId: undefined },
  },
  result: {
    data: {
      occurrence: {},
    },
  },
};
const now = Date.now();
const occurrenceMock: OccurrenceQuery = {
  occurrence: {
    __typename: 'OccurrenceNode',
    id: 'occurrence-id',
    time: new Date(now + 48 * 60 * 60 * 1000),
    event: {
      __typename: 'EventNode',
      id: 'event-id',
      description: 'event description',
      image: '',
      imageAltText: null,
      shortDescription: null,
      name: null,
      duration: null,
      participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
      eventGroup: null,
    },
    remainingCapacity: null,
    childHasFreeSpotNotificationSubscription: null,
    venue: {
      __typename: 'VenueNode',
      id: '',
      name: null,
      address: null,
      accessibilityInfo: null,
      arrivalInstructions: null,
      additionalInfo: null,
      wwwUrl: null,
      wcAndFacilities: null,
    },
  },
};

it('renders snapshot correctly', () => {
  const { container } = render(<EventIsEnrolled />, [emptyOccurrenceMock]);
  expect(container).toMatchSnapshot();
});

describe('unenrolment is possible only 48 before the occurrence', async () => {
  it.each(
    range(46, 51).map((hoursBeforeOccurrence) => ({
      hoursBeforeOccurrence,
      isCancellationAvailable:
        hoursBeforeOccurrence >= AppConfig.enrolmentCancellationTimeLimitHours, // 48h
    }))
  )(
    // eslint-disable-next-line max-len
    'shows unenrolment button enabled when occurrence is in $hoursBeforeOccurrence hours ($isCancellationAvailable)',
    async ({ hoursBeforeOccurrence, isCancellationAvailable }) => {
      const occurrenceQueryMock: MockedResponse = {
        request: {
          query: occurrenceQuery,
          variables: { id: undefined, childId: undefined },
        },
        result: {
          data: {
            ...occurrenceMock,
            occurrence: {
              ...occurrenceMock.occurrence,
              time: new Date(
                now + hoursBeforeOccurrence * 60 * 60 * 1000 + 10_000
              ), // Add 10 seconds (for rounding) to ensure the time is in the future
            },
          },
        },
      };
      render(<EventIsEnrolled />, [occurrenceQueryMock]);
      await screen.findByText('event description');
      const unenrolButton = await screen.findByRole('button', {
        name: 'Peru ilmoittautuminen',
      });
      if (isCancellationAvailable) {
        expect(unenrolButton).toBeEnabled();
      } else {
        expect(unenrolButton).toBeDisabled();
      }
    }
  );
});
