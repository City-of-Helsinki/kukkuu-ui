import { render } from '../../../common/test/testingLibraryUtils';
import { TicketSystem } from '../../api/generatedTypes/graphql';
import EventOccurrenceList from '../EventOccurrenceList';
import { Occurrences } from '../types/EventQueryTypes';

const mockedOccurrences: Occurrences = {
  edges: [
    {
      node: {
        id: 'T2NjdXJyZW5jZU5vZGU6MQ==', // Base64 encoded 'OccurrenceNode:1'
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
        ticketSystem: { type: TicketSystem.Internal },
        childHasFreeSpotNotificationSubscription: true,
      },
    },
    {
      node: {
        id: 'T2NjdXJyZW5jZU5vZGU6Mg==', // Base64 encoded 'OccurrenceNode:2'
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
        ticketSystem: { type: TicketSystem.Lippupiste },
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
