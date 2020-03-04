import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ProfileEventsList from '../ProfileEventsList';
import Card from '../../../../common/components/card/Card';

const childData = {
  id: '',
  firstName: '',
  lastName: '',
  birthdate: '',
  postalCode: '',
  relationships: {
    edges: [],
  },
};

const availableEvents = {
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
};

const enrolments = {
  edges: [
    {
      node: {
        occurrence: {
          venue: {
            name: '',
          },
          event: {
            id: 'RXZlbnROb2RlOjE=',
            name: 'pentti',
            shortDescription: 'eventti',
            image:
              'http://localhost:8081/media/2020-02-15-184035_1920x1080_scrot.png',
          },
        },
      },
    },
  ],
};

const pastEvents = {
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
};

const childWithEvents = {
  availableEvents: availableEvents,
  enrolments: enrolments,
  pastEvents: pastEvents,
  ...childData,
};

const childOnlyAvailableEvents = {
  availableEvents: availableEvents,
  enrolments: {
    edges: [],
  },
  pastEvents: null,
  ...childData,
};

const childOnlyEnrolments = {
  availableEvents: null,
  enrolments: {
    edges: [
      {
        node: {
          occurrence: {
            venue: {
              name: '',
            },
            event: {
              id: 'RXZlbnROb2RlOjE=',
              name: 'pentti',
              shortDescription: 'eventti',
              image:
                'http://localhost:8081/media/2020-02-15-184035_1920x1080_scrot.png',
            },
          },
        },
      },
    ],
  },
  pastEvents: null,
  ...childData,
};

const childOnlyPastEvents = {
  availableEvents: null,
  enrolments: {
    edges: [],
  },
  pastEvents: pastEvents,
  ...childData,
};

test('Renders snapshot correctly', () => {
  const input = shallow(
    <ProfileEventsList
      availableEvents={childWithEvents.availableEvents}
      enrolments={childWithEvents.enrolments}
      pastEvents={childWithEvents.pastEvents}
    />
  );
  expect(toJson(input)).toMatchSnapshot();
});

test('Renders only available events when no other events', () => {
  const wrapper = shallow(
    <ProfileEventsList
      availableEvents={childOnlyAvailableEvents.availableEvents}
      enrolments={childOnlyAvailableEvents.enrolments}
      pastEvents={childOnlyAvailableEvents.pastEvents}
    />
  );
  expect(wrapper.find('h2').length).toBe(1);
  expect(wrapper.find(Card).length).toBe(1);
});

test('Renders only enrolments when no other events', () => {
  const wrapper = shallow(
    <ProfileEventsList
      availableEvents={childOnlyEnrolments.availableEvents}
      enrolments={childOnlyEnrolments.enrolments}
      pastEvents={childOnlyEnrolments.pastEvents}
    />
  );
  expect(wrapper.find('h2').length).toBe(1);
  expect(wrapper.find(Card).length).toBe(1);
});

test('Renders only past events when no other events', () => {
  const wrapper = shallow(
    <ProfileEventsList
      availableEvents={childOnlyPastEvents.availableEvents}
      enrolments={childOnlyPastEvents.enrolments}
      pastEvents={childOnlyPastEvents.pastEvents}
    />
  );
  expect(wrapper.find('h2').length).toBe(1);
  expect(wrapper.find(Card).length).toBe(1);
});
