import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ProfileEventsList from '../ProfileEventsList';
import EventCard from '../../../event/eventCard/EventCard';
import {
  childByIdQuery_child as ChildByIdResponse,
  childByIdQuery_child_availableEventsAndEventGroups as AvailableEventsType,
  childByIdQuery_child_pastEvents as PastEventsType,
  childByIdQuery_child_occurrences as OccurrencesType,
} from '../../../api/generatedTypes/childByIdQuery';
import { EventParticipantsPerInvite } from '../../../api/generatedTypes/globalTypes';

const childData: ChildByIdResponse = {
  id: '',
  firstName: '',
  lastName: '',
  birthdate: '',
  postalCode: '',
  project: {
    id: '',
    year: 0,
  },
  relationships: { edges: [] },
  availableEventsAndEventGroups: { edges: [] },
  occurrences: { edges: [] },
  pastEvents: { edges: [] },
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

const availableEventsAndEventGroups: AvailableEventsType = {
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

const occurrences: OccurrencesType = {
  edges: [
    {
      node: {
        id: '',
        time: '2020-02-24T07:07:18+00:00', // 09.07
        venue: venueData,
        event: eventData,
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

const childWithEvents: ChildByIdResponse = {
  ...childData,
  availableEventsAndEventGroups: availableEventsAndEventGroups,
  occurrences: occurrences,
  pastEvents: pastEvents,
};

const childOnlyAvailableEvents = {
  ...childData,
  availableEventsAndEventGroups: availableEventsAndEventGroups,
  occurrences: {
    edges: [],
  },
  pastEvents: null,
};

const childOnlyEnrolments: ChildByIdResponse = {
  ...childData,
  availableEventsAndEventGroups: null,
  occurrences: {
    edges: [
      {
        node: {
          id: 'uu',
          time: '2020-02-24T09:09:09+00:00',
          venue: venueData,
          event: eventData,
        },
      },
    ],
  },
  pastEvents: null,
};

const childOnlyPastEvents: ChildByIdResponse = {
  ...childData,
  availableEventsAndEventGroups: null,
  occurrences: {
    edges: [],
  },
  pastEvents: pastEvents,
};

test('Renders snapshot correctly', () => {
  const wrapper = shallow(
    <ProfileEventsList
      availableEventsAndEventGroups={
        childWithEvents.availableEventsAndEventGroups
      }
      occurrences={childWithEvents.occurrences}
      pastEvents={childWithEvents.pastEvents}
      childId="zzaf"
    />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});

test('Renders only available events when no other events', () => {
  const wrapper = shallow(
    <ProfileEventsList
      availableEventsAndEventGroups={
        childOnlyAvailableEvents.availableEventsAndEventGroups
      }
      occurrences={childOnlyAvailableEvents.occurrences}
      pastEvents={childOnlyAvailableEvents.pastEvents}
      childId="zzaf"
    />
  );
  expect(wrapper.find('h2').length).toBe(1);
  expect(wrapper.find(EventCard).length).toBe(1);
});

test('Renders only enrolments when no other events', () => {
  const wrapper = shallow(
    <ProfileEventsList
      availableEventsAndEventGroups={
        childOnlyEnrolments.availableEventsAndEventGroups
      }
      occurrences={childOnlyEnrolments.occurrences}
      pastEvents={childOnlyEnrolments.pastEvents}
      childId="zzaf"
    />
  );
  expect(wrapper.find('h2').length).toBe(1);
  expect(wrapper.find(EventCard).length).toBe(1);
});

test('Renders only past events when no other events', () => {
  const wrapper = shallow(
    <ProfileEventsList
      availableEventsAndEventGroups={
        childOnlyPastEvents.availableEventsAndEventGroups
      }
      occurrences={childOnlyPastEvents.occurrences}
      pastEvents={childOnlyPastEvents.pastEvents}
      childId="zzaf"
    />
  );
  expect(wrapper.find('h2').length).toBe(1);
  expect(wrapper.find(EventCard).length).toBe(1);
});
