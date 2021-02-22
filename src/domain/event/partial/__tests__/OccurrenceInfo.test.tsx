import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import OccurrenceInfo from '../OccurrenceInfo';
import { mockedOccurrenceNode } from '../../__tests__/EventPage.test';
// eslint-disable-next-line max-len
import { childByIdQuery_child_occurrences_edges_node as OccurrenceNodes } from '../../../api/generatedTypes/childByIdQuery';
import { EventParticipantsPerInvite } from '../../../api/generatedTypes/globalTypes';

const z: OccurrenceNodes = {
  id: 'aa',
  time: '2020-03-08T04:00:00+00:00',
  event: {
    id: 'zzaaz',
    name: 'event name',
    image: 'a',
    imageAltText: 'b',
    shortDescription: 'd',
    duration: 12,
    participantsPerInvite: EventParticipantsPerInvite.FAMILY,
  },
  venue: {
    id: 'auppss',
    description: 'some venue description',
    name: 'Musiikkitalo',
    address: 'Urho Kekkosen katu 12',
  },
};

it('renders occurrence snapshot correctly', () => {
  const element = shallow(<OccurrenceInfo occurrence={mockedOccurrenceNode} />);
  expect(toJson(element)).toMatchSnapshot();
});

it('renders childByIdQuery occurrence snapshot correctly', () => {
  const element = shallow(<OccurrenceInfo occurrence={z} />);
  expect(toJson(element)).toMatchSnapshot();
});
