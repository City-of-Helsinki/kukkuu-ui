import ProfileEvents from '../ProfileEvents';
import { EventParticipantsPerInvite } from '../../../api/generatedTypes/graphql';
import { render } from '../../../../common/test/testingLibraryUtils';
import {
  ChildByIdResponse,
  UpcomingEventsAndEventGroups,
  PastEvents,
  InternalAndTicketSystemEnrolments,
} from '../../../child/types/ChildByIdQueryTypes';

vi.mock('react-qrcode-logo', async (importOriginal: any) => {
  const mod = await importOriginal();
  return {
    ...mod,
    QRCode: () => <div />,
  };
});

const childData: ChildByIdResponse = {
  id: '',
  name: '',
  birthyear: 0,
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

const upcomingEventsAndEventGroups: UpcomingEventsAndEventGroups = {
  edges: [
    {
      node: {
        id: 'RXZlbnROb2RlOjE=',
        name: 'pentti',
        shortDescription: 'eventti',
        participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
        image:
          'http://localhost:8081/media/2020-02-15-184035_1920x1080_scrot.png',
        imageAltText: 'uooo',
        canChildEnroll: true,
        __typename: 'EventNode',
      },
    },
  ],
};

const enrolments: InternalAndTicketSystemEnrolments = {
  edges: [
    {
      node: {
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
            participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
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
        participantsPerInvite: EventParticipantsPerInvite.Family,
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
                EventParticipantsPerInvite.ChildAndGuardian,
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
