import { occurrenceQuery_occurrence as OccurrenceQueryType } from '../../api/generatedTypes/occurrenceQuery';
import EventPage from '../EventPage';
import { EventParticipantsPerInvite } from '../../api/generatedTypes/globalTypes';
import { render } from '../../../common/test/testingLibraryUtils';

export const mockedOccurrenceNode: OccurrenceQueryType = {
  id: 'T2NjdXJyZW5jZU5vZGU6Mg==',
  time: '2020-03-08T04:00:00+00:00',
  remainingCapacity: 99,
  event: {
    id: 'zzaaz',
    name: 'event name',
    image: 'a',
    imageAltText: 'b',
    description: 'c',
    shortDescription: 'd',
    duration: 12,
    participantsPerInvite: EventParticipantsPerInvite.FAMILY,
    eventGroup: {
      id: 'e1',
    },
  },
  venue: {
    id: 'auppss',
    name: 'Musiikkitalo',
    address: '',
    accessibilityInfo: 'z',
    arrivalInstructions: 'y',
    additionalInfo: 'x',
    wwwUrl: 'https://example.com/z',
    wcAndFacilities: 'uio',
  },
  childHasFreeSpotNotificationSubscription: null,
};

it('renders snapshot correctly', () => {
  const { container } = render(
    <EventPage event={mockedOccurrenceNode.event} backTo={'/back-to'} />
  );
  expect(container).toMatchSnapshot();
});
