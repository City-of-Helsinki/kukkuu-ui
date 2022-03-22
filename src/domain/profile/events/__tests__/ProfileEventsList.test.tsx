import { MockedProvider } from '@apollo/client/testing';

import { render, screen } from '../../../../common/test/testingLibraryUtils';
import ProfileEventsList from '../ProfileEventsList';
import {
  childByIdQuery_child as ChildByIdResponse,
  childByIdQuery_child_upcomingEventsAndEventGroups as UpcomingEventsAndEventGroupsType,
  childByIdQuery_child_pastEvents as PastEventsType,
  childByIdQuery_child_occurrences as OccurrencesType,
} from '../../../api/generatedTypes/childByIdQuery';
import { EventParticipantsPerInvite } from '../../../api/generatedTypes/globalTypes';

jest.mock('react-qrcode-logo', () => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...jest.requireActual('react-qrcode-logo'),
  QRCode: () => <div />,
}));

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
  relationships: { edges: [] },
  upcomingEventsAndEventGroups: { edges: [] },
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
  canChildEnroll: true,
};

const upcomingEventsAndEventGroups: UpcomingEventsAndEventGroupsType = {
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
        enrolments: {
          edges: [],
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

const childWithEvents: ChildByIdResponse = {
  ...childData,
  upcomingEventsAndEventGroups,
  occurrences: occurrences,
  pastEvents: pastEvents,
};

const childOnlyAvailableEvents = {
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
          id: 'uu',
          time: '2020-02-24T09:09:09+00:00',
          venue: venueData,
          event: eventData,
          enrolments: {
            edges: [],
          },
        },
      },
    ],
  },
  pastEvents: null,
};

const childOnlyPastEvents: ChildByIdResponse = {
  ...childData,
  upcomingEventsAndEventGroups: null,
  occurrences: {
    edges: [],
  },
  pastEvents: pastEvents,
};

test('Renders snapshot correctly', () => {
  const { container } = render(
    <MockedProvider>
      <ProfileEventsList
        upcomingEventsAndEventGroups={
          childWithEvents.upcomingEventsAndEventGroups
        }
        occurrences={childWithEvents.occurrences}
        pastEvents={childWithEvents.pastEvents}
        childId="zzaf"
      />
    </MockedProvider>
  );
  expect(container).toMatchSnapshot();
});

test('Renders only upcoming events and event groups when no other inputs', () => {
  render(
    <MockedProvider>
      <ProfileEventsList
        upcomingEventsAndEventGroups={
          childOnlyAvailableEvents.upcomingEventsAndEventGroups
        }
        occurrences={childOnlyAvailableEvents.occurrences}
        pastEvents={childOnlyAvailableEvents.pastEvents}
        childId="zzaf"
      />
    </MockedProvider>
  );
  expect(
    screen.getByRole('heading', { name: 'Tapahtumakutsut' })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Tulevat tapahtumat' })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Menneet tapahtumat' })
  ).not.toBeInTheDocument();
});

test('Renders only enrolments when no other inputs', () => {
  render(
    <MockedProvider>
      <ProfileEventsList
        upcomingEventsAndEventGroups={
          childOnlyEnrolments.upcomingEventsAndEventGroups
        }
        occurrences={childOnlyEnrolments.occurrences}
        pastEvents={childOnlyEnrolments.pastEvents}
        childId="zzaf"
      />
    </MockedProvider>
  );

  expect(
    screen.queryByRole('heading', { name: 'Tapahtumakutsut' })
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Tulevat tapahtumat' })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Menneet tapahtumat' })
  ).not.toBeInTheDocument();
});

test('Renders only past events when no other inputs', () => {
  render(
    <MockedProvider>
      <ProfileEventsList
        upcomingEventsAndEventGroups={
          childOnlyPastEvents.upcomingEventsAndEventGroups
        }
        occurrences={childOnlyPastEvents.occurrences}
        pastEvents={childOnlyPastEvents.pastEvents}
        childId="zzaf"
      />
    </MockedProvider>
  );

  expect(
    screen.queryByRole('heading', { name: 'Tapahtumakutsut' })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Tulevat tapahtumat' })
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Menneet tapahtumat' })
  ).toBeInTheDocument();
});
