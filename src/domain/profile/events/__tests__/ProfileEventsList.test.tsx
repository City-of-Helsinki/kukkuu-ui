import React from 'react';
import { MockedResponse } from '@apollo/client/testing';
import { screen } from '@testing-library/react';

import { customRender as render } from '../../../../common/test/customRender';
import ProfileEventsList from '../ProfileEventsList';
import {
  EnrolmentDeniedReason,
  EventParticipantsPerInvite,
} from '../../../api/generatedTypes/graphql';
import {
  ChildByIdResponse,
  UpcomingEventOrEventGroup,
  UpcomingEventsAndEventGroups,
  PastEvents,
  InternalAndTicketSystemEnrolments,
} from '../../../child/types/ChildByIdQueryTypes';
import { childEnrolmentCountQuery } from '../../../child/queries/ChildEnrolmentCountQuery';

vi.mock('react-qrcode-logo', async (importOriginal: any) => {
  const mod = await importOriginal();
  return {
    ...mod,
    QRCode: () => <div />,
  };
});

const testChildId = 'zzaf';

const childData: ChildByIdResponse = {
  id: testChildId,
  name: '',
  birthyear: 0,
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
  participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
  occurrences: { edges: [] },
  enrolmentDeniedReason: null,
  registrationOpensAt: null,
};

const upcomingEventsAndEventGroups: UpcomingEventsAndEventGroups = {
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

const enrolments: InternalAndTicketSystemEnrolments = {
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

const pastEvents: PastEvents = {
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

const childWithTixlyEnrolment: ChildByIdResponse = {
  ...childData,
  upcomingEventsAndEventGroups: null,
  activeInternalAndTicketSystemEnrolments: {
    edges: [
      {
        node: {
          __typename: 'TixlyEnrolmentNode',
          id: 'tixly-123',
          event: eventData,
        },
      },
    ],
  },
  pastEvents: null,
};

const getChildEnrolmentCountMock = ({
  pastEnrolmentCount = 0,
}: {
  pastEnrolmentCount?: number;
} = {}): MockedResponse => ({
  request: {
    query: childEnrolmentCountQuery,
    variables: { childId: testChildId },
  },
  result: {
    data: {
      child: {
        id: childData.id,
        enrolmentCount: 0,
        pastEnrolmentCount,
        project: {
          id: childData.project.id,
          enrolmentLimit: 1,
        },
      },
    },
  },
});

const mocks: MockedResponse[] = [getChildEnrolmentCountMock()];

test('Renders snapshot correctly', () => {
  const { container } = render(
    <ProfileEventsList
      upcomingEventsAndEventGroups={
        childWithEvents.upcomingEventsAndEventGroups
      }
      enrolments={childOnlyEnrolments.activeInternalAndTicketSystemEnrolments}
      pastEvents={childWithEvents.pastEvents}
      childId={testChildId}
    />,
    mocks
  );
  expect(container).toMatchSnapshot();
});

test('Renders only upcoming events and event groups when no other inputs', () => {
  render(
    <ProfileEventsList
      upcomingEventsAndEventGroups={
        childOnlyAvailableEvents.upcomingEventsAndEventGroups
      }
      enrolments={
        childOnlyAvailableEvents.activeInternalAndTicketSystemEnrolments
      }
      pastEvents={childOnlyAvailableEvents.pastEvents}
      childId={testChildId}
    />,
    mocks
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
    <ProfileEventsList
      upcomingEventsAndEventGroups={
        childOnlyEnrolments.upcomingEventsAndEventGroups
      }
      enrolments={childOnlyEnrolments.activeInternalAndTicketSystemEnrolments}
      pastEvents={childOnlyEnrolments.pastEvents}
      childId={testChildId}
    />,
    mocks
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
  ['Tixly', childWithTixlyEnrolment.activeInternalAndTicketSystemEnrolments],
])('Renders %s enrolment', (_, enrolments) => {
  render(
    <ProfileEventsList
      upcomingEventsAndEventGroups={{
        edges: [],
      }}
      enrolments={enrolments}
      pastEvents={{
        edges: [],
      }}
      childId={testChildId}
    />,
    mocks
  );

  expect(screen.getByText('eventti')).toBeInTheDocument();
});

describe('registration not open', () => {
  const renderUpcoming = (
    node: UpcomingEventOrEventGroup,
    mocks: MockedResponse[]
  ) =>
    render(
      <ProfileEventsList
        upcomingEventsAndEventGroups={{ edges: [{ node }] }}
        enrolments={{ edges: [] }}
        pastEvents={{ edges: [] }}
        childId={testChildId}
      />,
      mocks
    );

  const notOpenEvent = (
    registrationOpensAt: string | null
  ): UpcomingEventOrEventGroup => ({
    ...eventData,
    __typename: 'EventNode',
    enrolmentDeniedReason: EnrolmentDeniedReason.RegistrationNotOpen,
    registrationOpensAt,
  });

  const notOpenEventGroup = (
    registrationOpensAts: Array<string | null>
  ): UpcomingEventOrEventGroup => ({
    id: 'RXZlbnRHcm91cE5vZGU6MQ==',
    name: 'ryhmä',
    shortDescription: 'ryhmäkuvaus',
    image: '',
    imageAltText: '',
    enrolmentDeniedReason: EnrolmentDeniedReason.RegistrationNotOpen,
    events: {
      edges: registrationOpensAts.map((registrationOpensAt, index) => ({
        node: { id: `event-${index}`, registrationOpensAt },
      })),
    },
    __typename: 'EventGroupNode',
  });

  test('event card tells when registration opens', async () => {
    renderUpcoming(notOpenEvent('2099-06-01T10:00:00+03:00'), mocks);

    expect(
      await screen.findByText('Ilmoittautuminen alkaa 1.6.2099 klo 10:00')
    ).toBeInTheDocument();
  });

  test('event card says registration has not opened when there is no opening time', async () => {
    renderUpcoming(notOpenEvent(null), mocks);

    expect(
      await screen.findByText('Ilmoittautuminen ei ole vielä alkanut')
    ).toBeInTheDocument();
  });

  test('event group card tells when the first event opens for registration', async () => {
    renderUpcoming(
      notOpenEventGroup([
        '2099-07-01T12:00:00+03:00',
        '2099-06-01T10:00:00+03:00',
        null,
      ]),
      mocks
    );

    expect(
      await screen.findByText('Ilmoittautuminen alkaa 1.6.2099 klo 10:00')
    ).toBeInTheDocument();
  });

  test('event group card says registration has not opened when no event has an opening time', async () => {
    renderUpcoming(notOpenEventGroup([null]), mocks);

    expect(
      await screen.findByText('Ilmoittautuminen ei ole vielä alkanut')
    ).toBeInTheDocument();
  });

  test('already enrolled text wins when the child has no enrolments left', async () => {
    renderUpcoming(notOpenEvent('2099-06-01T10:00:00+03:00'), [
      getChildEnrolmentCountMock({ pastEnrolmentCount: 1 }),
    ]);

    expect(
      await screen.findByText(
        'Huomioithan, että et voi ilmoittautua tähän tapahtumaan.'
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Ilmoittautuminen alkaa 1.6.2099 klo 10:00')
    ).not.toBeInTheDocument();
  });
});
