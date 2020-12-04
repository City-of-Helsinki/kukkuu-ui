import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ProfileEvents from '../ProfileEvents';
import ProfileNoEvent from '../ProfileNoEvent';
import ProfileEventsList from '../ProfileEventsList';
import {
  childByIdQuery_child as ChildByIdResponse,
  childByIdQuery_child_availableEventsAndEventGroups as AvailableEvents,
  childByIdQuery_child_pastEvents as PastEvents,
  childByIdQuery_child_occurrences as Occurrences,
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
  relationships: {
    edges: [],
  },
  availableEventsAndEventGroups: { edges: [] },
  occurrences: { edges: [] },
  pastEvents: { edges: [] },
};

const childNoEvents = {
  ...childData,
  availableEventsAndEventGroups: null,
  enrolments: {
    edges: [],
  },
  pastEvents: null,
};

const availableEventsAndEventGroups: AvailableEvents = {
  edges: [
    {
      node: {
        id: 'RXZlbnROb2RlOjE=',
        name: 'pentti',
        shortDescription: 'eventti',
        participantsPerInvite: EventParticipantsPerInvite.CHILD_AND_GUARDIAN,
        image:
          'http://localhost:8081/media/2020-02-15-184035_1920x1080_scrot.png',
        imageAltText: 'uooo',
      },
    },
  ],
};

const occurrences: Occurrences = {
  edges: [
    {
      node: {
        id: '',
        time: '',
        venue: {
          id: '',
          address: '',
          description: '',
          name: '',
        },
        event: {
          id: 'RXZlbnROb2RlOjE=',
          duration: 12,
          name: 'pentti',
          participantsPerInvite: EventParticipantsPerInvite.CHILD_AND_GUARDIAN,
          shortDescription: 'eventti',
          image:
            'http://localhost:8081/media/2020-02-15-184035_1920x1080_scrot.png',
          imageAltText: 'uooo',
        },
      },
    },
  ],
};

const pastEvents: PastEvents = {
  edges: [
    {
      node: {
        id: 'RXZlbnROb2RlOjE=',
        participantsPerInvite: EventParticipantsPerInvite.FAMILY,
        name: 'pentti',
        shortDescription: 'eventti',
        image:
          'http://localhost:8081/media/2020-02-15-184035_1920x1080_scrot.png',
        imageAltText: 'uooo',
        occurrences: {
          edges: [],
        },
      },
    },
  ],
};

const childWithEvents: ChildByIdResponse = {
  ...childData,
  availableEventsAndEventGroups: availableEventsAndEventGroups,
  occurrences: occurrences,
  pastEvents: pastEvents,
};

const childOnlyAvailableEvents: ChildByIdResponse = {
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
          id: '',
          time: '',
          venue: {
            id: '',
            address: '',
            description: '',
            name: '',
          },
          event: {
            id: 'RXZlbnROb2RlOjE=',
            name: 'pentti',
            shortDescription: 'eventti',
            duration: null,
            participantsPerInvite: EventParticipantsPerInvite.FAMILY,
            imageAltText: 'uooo',
            image:
              'http://localhost:8081/media/2020-02-15-184035_1920x1080_scrot.png',
          },
        },
      },
    ],
  },
  pastEvents: null,
};

const childOnlyPastEvents = {
  ...childData,
  availableEventsAndEventGroups: null,
  enrolments: {
    edges: [],
  },
  pastEvents: pastEvents,
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
        childId={childWithEvents.id}
        availableEventsAndEventGroups={
          childWithEvents.availableEventsAndEventGroups
        }
        occurrences={childWithEvents.occurrences}
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
        childId={childWithEvents.id}
        availableEventsAndEventGroups={
          childWithEvents.availableEventsAndEventGroups
        }
        occurrences={childWithEvents.occurrences}
        pastEvents={childWithEvents.pastEvents}
      />
    )
  ).toEqual(true);
});

test('Renders events list when only availableEventsAndEventGroups', () => {
  const wrapper = shallow(<ProfileEvents child={childOnlyAvailableEvents} />);
  expect(
    wrapper.equals(
      <ProfileEventsList
        childId={childOnlyAvailableEvents.id}
        availableEventsAndEventGroups={
          childOnlyAvailableEvents.availableEventsAndEventGroups
        }
        occurrences={childOnlyAvailableEvents.occurrences}
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
        childId={childOnlyEnrolments.id}
        availableEventsAndEventGroups={
          childOnlyEnrolments.availableEventsAndEventGroups
        }
        occurrences={childOnlyEnrolments.occurrences}
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
        childId={childOnlyPastEvents.id}
        availableEventsAndEventGroups={
          childOnlyPastEvents.availableEventsAndEventGroups
        }
        occurrences={childOnlyPastEvents.enrolments}
        pastEvents={childOnlyPastEvents.pastEvents}
      />
    )
  ).toEqual(true);
});
