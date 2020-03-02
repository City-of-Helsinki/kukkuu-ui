import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { eventQuery_event_occurrences_edges_node as OccurrenceEdgeNode } from '../../api/generatedTypes/eventQuery';
import EventOccurrence from '../EventOccurrence';

const mockedNode: OccurrenceEdgeNode = {
  id: 'T2NjdXJyZW5jZU5vZGU6Mg==',
  time: '2020-03-08T04:00:00+00:00',
  remainingCapacity: 99,
  venue: {
    name: 'Musiikkitalo',
    description: '',
    address: '',
  },
};

it('renders snapshot correctly', () => {
  const element = shallow(
    <EventOccurrence key={mockedNode.id} occurrence={mockedNode} />
  );
  expect(toJson(element)).toMatchSnapshot();
});
