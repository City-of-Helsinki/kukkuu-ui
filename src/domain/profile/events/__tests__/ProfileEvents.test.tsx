import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ProfileEvents from '../ProfileEvents';
import ProfileNoEvent from '../ProfileNoEvent';
import ProfileEventsList from '../ProfileEventsList';
import {
  childByIdQuery_child as ChildByIdResponse,
  childByIdQuery_child_upcomingEventsAndEventGroups as UpcomingEvents,
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
    name: 'Test project',
  },
  relationships: {
    edges: [],
  },
  upcomingEventsAndEventGroups: { edges: [] },
  occurrences: { edges: [] },
  pastEvents: { edges: [] },
};

const childNoEvents = {
  ...childData,
  upcomingEvents: null,
  enrolments: {
    edges: [],
  },
  pastEvents: null,
};

const upcomingEventsAndEventGroups: UpcomingEvents = {
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
        canChildEnroll: true,
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
        enrolments: {
          edges: [],
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
  upcomingEventsAndEventGroups,
  occurrences: occurrences,
  pastEvents: pastEvents,
};

const childOnlyAvailableEvents: ChildByIdResponse = {
  ...childData,
  upcomingEventsAndEventGroups,
  occurrences: {
    edges: [],
  },
  pastEvents: null,
};

const childOnlyEnrolments: ChildByIdResponse = {
  ...childData,
  upcomingEventsAndEventGroups: null,
  occurrences: {
    edges: [
      {
        node: {
          id: '',
          time: '',
          venue: {
            id: '',
            address: '',
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
          enrolments: {
            edges: [],
          },
        },
      },
    ],
  },
  pastEvents: null,
};

const childOnlyPastEvents = {
  ...childData,
  upcomingEventsAndEventGroups: null,
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
        upcomingEventsAndEventGroups={
          childWithEvents.upcomingEventsAndEventGroups
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
        upcomingEventsAndEventGroups={
          childWithEvents.upcomingEventsAndEventGroups
        }
        occurrences={childWithEvents.occurrences}
        pastEvents={childWithEvents.pastEvents}
      />
    )
  ).toEqual(true);
});

test('Renders events list when only upcomingEventsAndEventGroups', () => {
  const wrapper = shallow(<ProfileEvents child={childOnlyAvailableEvents} />);
  expect(
    wrapper.equals(
      <ProfileEventsList
        childId={childOnlyAvailableEvents.id}
        upcomingEventsAndEventGroups={
          childOnlyAvailableEvents.upcomingEventsAndEventGroups
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
        upcomingEventsAndEventGroups={
          childOnlyEnrolments.upcomingEventsAndEventGroups
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
        upcomingEventsAndEventGroups={
          childOnlyPastEvents.upcomingEventsAndEventGroups
        }
        occurrences={childOnlyPastEvents.enrolments}
        pastEvents={childOnlyPastEvents.pastEvents}
      />
    )
  ).toEqual(true);
});
