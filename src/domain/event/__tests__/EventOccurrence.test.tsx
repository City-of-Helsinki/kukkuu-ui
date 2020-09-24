import React from 'react';
import toJson from 'enzyme-to-json';

import { mountWithProvider } from '../../../common/test/testUtils';
import { eventQuery_event_occurrences_edges_node as OccurrenceEdgeNode } from '../../api/generatedTypes/eventQuery';
import EventOccurrence from '../EventOccurrence';

const mockedNode: OccurrenceEdgeNode = {
  id: 'T2NjdXJyZW5jZU5vZGU6Mg==',
  time: '2020-03-08T04:00:00+00:00',
  remainingCapacity: 99,
  event: {
    id: 'zzaaz',
    name: 'event name',
  },
  venue: {
    id: 'auppss',
    name: 'Musiikkitalo',
    address: '',
  },
  childHasFreeSpotNotificationSubscription: false,
};
const defaultProps = {
  occurrence: mockedNode,
};

const getWrapper = (props: unknown = {}) =>
  mountWithProvider(
    <table>
      <tbody>
        <EventOccurrence {...defaultProps} {...props} />
      </tbody>
    </table>
  );

it('renders snapshot correctly', () => {
  const element = getWrapper({ key: mockedNode.id });
  expect(toJson(element)).toMatchSnapshot();
});

it('renders button for signing up to an event', () => {
  const wrapper = getWrapper();

  expect(wrapper.text().includes('Valitse')).toEqual(true);
});

describe('when event is full and child has not subscribed to notifications', () => {
  const getFullEventWrapper = () =>
    getWrapper({
      occurrence: {
        ...mockedNode,
        remainingCapacity: 0,
        childHasFreeSpotNotificationSubscription: false,
      },
    });

  it('renders button for subscribing', () => {
    const wrapper = getFullEventWrapper();

    expect(wrapper.text().includes('Täynnä - Tilaa ilmoitus')).toEqual(true);
  });
});

describe('when event is full and child has not subscribed to notifications', () => {
  const getFullEventWrapper = () =>
    getWrapper({
      occurrence: {
        ...mockedNode,
        remainingCapacity: 0,
        childHasFreeSpotNotificationSubscription: true,
      },
    });

  it('renders button for subscribing', () => {
    const wrapper = getFullEventWrapper();

    expect(wrapper.text().includes('Peru ilmoitusten tilaus')).toEqual(true);
  });
});
