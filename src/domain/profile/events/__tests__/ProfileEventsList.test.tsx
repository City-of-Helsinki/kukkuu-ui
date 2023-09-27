import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import * as reactQrCodeLogo from 'react-qrcode-logo';

import { render, screen } from '../../../../common/test/testingLibraryUtils';
import ProfileEventsList from '../ProfileEventsList';
import {
  childByIdQuery_child as ChildByIdResponse,
  childByIdQuery_child_upcomingEventsAndEventGroups as UpcomingEventsAndEventGroupsType,
  childByIdQuery_child_pastEvents as PastEventsType,
  childByIdQuery_child_activeInternalAndTicketSystemEnrolments as InternalAndTicketSystemEnrolmentsType,
} from '../../../api/generatedTypes/childByIdQuery';
import { EventParticipantsPerInvite } from '../../../api/generatedTypes/globalTypes';

vi.spyOn(reactQrCodeLogo, 'QRCode').mockImplementation(() => (<div />) as any);

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
  activeInternalAndTicketSystemEnrolments: { edges: [] },
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
      node: { ...eventData, __typename: 'EventNode' },
    },
  ],
};

const venueData = {
  id: 'uuap',
  name: 'aa',
  description: 'zzww',
  address: 'ssfas uus 12',
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
            venue: venueData,
            event: eventData,
          },
        },
      },
    ],
  },
  pastEvents: null,
};

const childWithTicketmasterEnrolment: ChildByIdResponse = {
  ...childData,
  upcomingEventsAndEventGroups: null,
  activeInternalAndTicketSystemEnrolments: {
    edges: [
      {
        node: {
          __typename: 'TicketmasterEnrolmentNode',
          id: 'ticketmaster-123',
          event: eventData,
        },
      },
    ],
  },
  pastEvents: null,
};

const childWithLippupisteEnrolment: ChildByIdResponse = {
  ...childData,
  upcomingEventsAndEventGroups: null,
  activeInternalAndTicketSystemEnrolments: {
    edges: [
      {
        node: {
          __typename: 'LippupisteEnrolmentNode',
          id: 'lippupiste-123',
          event: eventData,
        },
      },
    ],
  },
  pastEvents: null,
};

test('Renders snapshot correctly', () => {
  const { container } = render(
    <MockedProvider>
      <ProfileEventsList
        upcomingEventsAndEventGroups={
          childWithEvents.upcomingEventsAndEventGroups
        }
        enrolments={childOnlyEnrolments.activeInternalAndTicketSystemEnrolments}
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
        enrolments={
          childOnlyAvailableEvents.activeInternalAndTicketSystemEnrolments
        }
        pastEvents={childOnlyAvailableEvents.pastEvents}
        childId="zzaf"
      />
    </MockedProvider>
  );
  expect(
    screen.getByRole('heading', { name: 'Tapahtumakutsut' })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Tulevat tapahtumasi' })
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
        enrolments={childOnlyEnrolments.activeInternalAndTicketSystemEnrolments}
        pastEvents={childOnlyEnrolments.pastEvents}
        childId="zzaf"
      />
    </MockedProvider>
  );

  expect(
    screen.queryByRole('heading', { name: 'Tapahtumakutsut' })
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Tulevat tapahtumasi' })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Menneet tapahtumat' })
  ).not.toBeInTheDocument();
});

test.each([
  [
    'Ticketmaster',
    childWithTicketmasterEnrolment.activeInternalAndTicketSystemEnrolments,
  ],
  [
    'Lippupiste',
    childWithLippupisteEnrolment.activeInternalAndTicketSystemEnrolments,
  ],
])('Renders %s enrolment', (_, enrolments) => {
  render(
    <MockedProvider>
      <ProfileEventsList
        upcomingEventsAndEventGroups={{
          edges: [],
        }}
        enrolments={enrolments}
        pastEvents={{
          edges: [],
        }}
        childId="zzaf"
      />
    </MockedProvider>
  );

  expect(screen.getByText('eventti')).toBeInTheDocument();
});
