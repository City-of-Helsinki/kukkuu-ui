import { render } from '../../../common/test/testingLibraryUtils';
import { eventQuery_event_occurrences as Occurrences } from '../../api/generatedTypes/eventQuery';
import { TicketSystem } from '../../api/generatedTypes/globalTypes';
import EventOccurrenceList from '../EventOccurrenceList';

const mockedOccurrences: Occurrences = {
  edges: [
    {
      node: {
        id: 'T2NjdXJyZW5jZU5vZGU6Mg==',
        time: '2020-03-08T04:00:00+00:00',
        remainingCapacity: 99,
        event: {
          id: 'asdf',
          name: 'asdf',
          duration: 60,
        },
        venue: {
          id: 'fdsa',
          name: 'Musiikkitalo',
          address: 'Mannerheimintie 13A, Helsinki',
        },
        ticketSystem: { type: TicketSystem.INTERNAL },
        childHasFreeSpotNotificationSubscription: true,
      },
    },
    {
      node: {
        id: 'T2NjdXJyZW5jZU5vZGU6Mg==',
        time: '2020-04-08T04:00:00+00:00',
        remainingCapacity: 88,
        event: {
          id: 'asdf',
          name: 'asdf',
          duration: 60,
        },
        venue: {
          id: 'fdsa1',
          name: 'Somewhere',
          address: 'Rainbow 123',
        },
        ticketSystem: { type: TicketSystem.LIPPUPISTE },
        childHasFreeSpotNotificationSubscription: false,
      },
    },
  ],
};

it('renders snapshot correctly', () => {
  const { container } = render(
    <EventOccurrenceList occurrences={mockedOccurrences} />
  );
  expect(container).toMatchSnapshot();
});
