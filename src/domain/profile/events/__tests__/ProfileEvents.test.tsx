import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ProfileEvents from '../ProfileEvents';
import ProfileNoEvent from '../ProfileNoEvent';
import ProfileEventsList from '../ProfileEventsList';

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

const childNoEvents = {
  availableEvents: null,
  enrolments: {
    edges: [],
  },
  pastEvents: null,
  ...childData,
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
  const input = shallow(<ProfileEvents child={childNoEvents} />);
  console.log(input.debug());
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

test('Renders events list when only availableEvents', () => {
  const wrapper = shallow(<ProfileEvents child={childOnlyAvailableEvents} />);
  expect(
    wrapper.equals(
      <ProfileEventsList
        availableEvents={childOnlyAvailableEvents.availableEvents}
        enrolments={childOnlyAvailableEvents.enrolments}
        pastEvents={childOnlyAvailableEvents.pastEvents}
      />
    )
  ).toEqual(true);
});

test('Renders events list when only enrolments', () => {
  const wrapper = shallow(<ProfileEvents child={childOnlyEnrolments} />);
  expect(
    wrapper.equals(
      <ProfileEventsList
        availableEvents={childOnlyEnrolments.availableEvents}
        enrolments={childOnlyEnrolments.enrolments}
        pastEvents={childOnlyEnrolments.pastEvents}
      />
    )
  ).toEqual(true);
});

test('Renders events list when only past events', () => {
  const wrapper = shallow(<ProfileEvents child={childOnlyPastEvents} />);
  expect(
    wrapper.equals(
      <ProfileEventsList
        availableEvents={childOnlyPastEvents.availableEvents}
        enrolments={childOnlyPastEvents.enrolments}
        pastEvents={childOnlyPastEvents.pastEvents}
      />
    )
  ).toEqual(true);
});
