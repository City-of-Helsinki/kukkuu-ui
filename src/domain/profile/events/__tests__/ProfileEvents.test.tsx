import ProfileEvents from '../ProfileEvents';
import {
  childByIdQuery_child as ChildByIdResponse,
  childByIdQuery_child_upcomingEventsAndEventGroups as UpcomingEvents,
  childByIdQuery_child_pastEvents as PastEvents,
  childByIdQuery_child_activeInternalAndTicketSystemEnrolments as InternalAndTicketSystemEnrolmentsType,
} from '../../../api/generatedTypes/childByIdQuery';
import { EventParticipantsPerInvite } from '../../../api/generatedTypes/globalTypes';
import { render } from '../../../../common/test/testingLibraryUtils';

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
  activeInternalAndTicketSystemEnrolments: { edges: [] },
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
        __typename: 'EventNode',
      },
    },
  ],
};

const enrolments: InternalAndTicketSystemEnrolmentsType = {
  edges: [
    {
      node: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        __typename: 'EnrolmentNode',
        id: 'foo',
        referenceId: 'bar',
        occurrence: {
          id: '',
          time: '2020-02-24T07:07:18+00:00', // 09.07
          venue: {
            id: '',
            address: '',
            name: '',
          },
          event: {
            id: 'RXZlbnROb2RlOjE=',
            duration: 12,
            name: 'pentti',
            participantsPerInvite:
              EventParticipantsPerInvite.CHILD_AND_GUARDIAN,
            shortDescription: 'eventti',
            image:
              'http://localhost:8081/media/2020-02-15-184035_1920x1080_scrot.png',
            imageAltText: 'uooo',
          },
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
  activeInternalAndTicketSystemEnrolments: enrolments,
  pastEvents: pastEvents,
};

const childOnlyAvailableEvents = {
  ...childData,
  upcomingEventsAndEventGroups,
  enrolments: {
    edges: [],
  },
  pastEvents: null,
};

const childOnlyEnrolments: ChildByIdResponse = {
  ...childData,
  upcomingEventsAndEventGroups: null,
  activeInternalAndTicketSystemEnrolments: {
    edges: [
      {
        node: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          __typename: 'EnrolmentNode',
          id: 'foo',
          referenceId: 'bar',
          occurrence: {
            id: 'uu',
            time: '2020-02-24T09:09:09+00:00',
            venue: {
              id: '',
              address: '',
              name: '',
            },
            event: {
              id: 'RXZlbnROb2RlOjE=',
              duration: 12,
              name: 'pentti',
              participantsPerInvite:
                EventParticipantsPerInvite.CHILD_AND_GUARDIAN,
              shortDescription: 'eventti',
              image:
                'http://localhost:8081/media/2020-02-15-184035_1920x1080_scrot.png',
              imageAltText: 'uooo',
            },
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

test('Renders "No events" when no events"', () => {
  const { container } = render(<ProfileEvents child={childNoEvents} />);
  expect(container).toMatchSnapshot();
});

test('Renders events list when events of any type', () => {
  const { container } = render(<ProfileEvents child={childWithEvents} />);
  expect(container).toMatchSnapshot();
});

test('Renders events list when only upcomingEventsAndEventGroups', () => {
  const { container } = render(
    <ProfileEvents child={childOnlyAvailableEvents} />
  );
  expect(container).toMatchSnapshot();
});

test('Renders events list when only enrolments', () => {
  const { container } = render(<ProfileEvents child={childOnlyEnrolments} />);
  expect(container).toMatchSnapshot();
});

test('Renders events list when only past events', () => {
  const { container } = render(<ProfileEvents child={childOnlyPastEvents} />);
  expect(container).toMatchSnapshot();
});
