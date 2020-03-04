import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ProfileEvents from '../ProfileEvents';
import ProfileNoEvent from '../ProfileNoEvent';
import ProfileEventsList from '../ProfileEventsList';

const childNoEvents = {
  id: '',
  firstName: '',
  lastName: '',
  birthdate: '',
  postalCode: '',
  availableEvents: null,
  enrolments: {
    edges: [],
  },
  pastEvents: null,
  relationships: {
    edges: [],
  },
};

const childWithEvents = {
  id: '',
  firstName: '',
  lastName: '',
  birthdate: '',
  postalCode: '',
  availableEvents: {
    edges: [
      {
        node: {
          id: 'RXZlbnROb2RlOjE=',
          name: 'pentti',
          shortDescription: 'eventti',
          image:
            'http://localhost:8081/media/2020-02-15-184035_1920x1080_scrot.png',
        },
      },
    ],
  },
  enrolments: {
    edges: [],
  },
  pastEvents: null,
  relationships: {
    edges: [],
  },
};

test('Renders snapshot correctly', () => {
  const input = shallow(<ProfileEvents child={childNoEvents} />);
  expect(toJson(input)).toMatchSnapshot();
});

test('Renders "No events" when no events"', () => {
  const wrapper = shallow(<ProfileEvents child={childNoEvents} />);
  expect(wrapper.equals(<ProfileNoEvent />)).toEqual(true);
  expect(
    wrapper.equals(
      <ProfileEventsList
        availableEvents={childWithEvents.availableEvents}
        enrolments={childWithEvents.enrolments}
        pastEvents={childWithEvents.pastEvents}
      />
    )
  ).toEqual(false);
});

test('Renders events list when events of any type', () => {
  const wrapper = shallow(<ProfileEvents child={childWithEvents} />);
  expect(
    wrapper.equals(
      <ProfileEventsList
        availableEvents={childWithEvents.availableEvents}
        enrolments={childWithEvents.enrolments}
        pastEvents={childWithEvents.pastEvents}
      />
    )
  ).toEqual(true);
});
