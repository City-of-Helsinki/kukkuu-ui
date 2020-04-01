import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ProfileEventsList from '../ProfileEventsList';
import Card from '../../../../common/components/card/Card';
import {
  childByIdQuery_child as ChildType,
  childByIdQuery_child_availableEvents as AvailableEventsType,
  childByIdQuery_child_enrolments as EnrolmentsType,
  childByIdQuery_child_pastEvents as PastEventsType,
} from '../../../api/generatedTypes/childByIdQuery';
import { EventParticipantsPerInvite } from '../../../api/generatedTypes/globalTypes';

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

const eventData = {
  id: 'RXZlbnROb2RlOjE=',
  name: 'pentti',
  shortDescription: 'eventti',
  image: 'http://localhost:8081/media/2020-02-15-184035_1920x1080_scrot.png',
  imageAltText: 'huhuu',
  duration: 60,
  participantsPerInvite: EventParticipantsPerInvite.CHILD_AND_GUARDIAN,
  occurrences: { edges: [] },
};

const availableEvents: AvailableEventsType = {
  edges: [
    {
      node: eventData,
    },
  ],
};

const venueData = {
  id: 'uuap',
  name: 'aa',
  description: 'zzww',
  address: 'ssfas uus 12',
};

const enrolments: EnrolmentsType = {
  edges: [
    {
      node: {
        occurrence: {
          id: '',
          time: '2020-02-24T07:07:18+00:00', // 09.07
          venue: venueData,
          event: eventData,
        },
      },
    },
  ],
};

const pastEvents: PastEventsType = {
  edges: [
    {
      node: eventData,
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

const childOnlyEnrolments: ChildType = {
  availableEvents: null,
  enrolments: {
    edges: [
      {
        node: {
          occurrence: {
            id: 'uu',
            time: '2020-02-24T09:09:09+00:00',
            venue: venueData,
            event: eventData,
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
  const wrapper = shallow(
    <ProfileEventsList
      availableEvents={childWithEvents.availableEvents}
      enrolments={childWithEvents.enrolments}
      pastEvents={childWithEvents.pastEvents}
      childId="zzaf"
    />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});

test('Renders only available events when no other events', () => {
  const wrapper = shallow(
    <ProfileEventsList
      availableEvents={childOnlyAvailableEvents.availableEvents}
      enrolments={childOnlyAvailableEvents.enrolments}
      pastEvents={childOnlyAvailableEvents.pastEvents}
      childId="zzaf"
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
      childId="zzaf"
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
      childId="zzaf"
    />
  );
  expect(wrapper.find('h2').length).toBe(1);
  expect(wrapper.find(Card).length).toBe(1);
});
