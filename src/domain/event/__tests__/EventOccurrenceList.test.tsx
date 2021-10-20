import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { eventQuery_event_occurrences as Occurrences } from '../../api/generatedTypes/eventQuery';
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
        },
        venue: {
          id: 'fdsa',
          name: 'Musiikkitalo',
          description: 'Helsingin oma Musiikkitalo',
          address: 'Mannerheimintie 13A, Helsinki',
        },
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
        },
        venue: {
          id: 'fdsa1',
          name: 'Somewhere',
          description: 'Under the',
          address: 'Rainbow 123',
        },
      },
    },
  ],
};

it('renders snapshot correctly', () => {
  const element = shallow(
    <EventOccurrenceList
      occurrences={mockedOccurrences}
      eventId={'sksksksksksk'}
    />
  );
  expect(toJson(element)).toMatchSnapshot();
});
