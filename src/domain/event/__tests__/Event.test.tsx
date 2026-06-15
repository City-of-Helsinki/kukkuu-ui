// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// FIXME: Fix types and re-enable Typescript checking by removing @ts-nocheck
import { vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import * as Sentry from '@sentry/browser';

import { customRender as render } from '../../../common/test/customRender';
import Event from '../Event';
import eventQuery, {
  eventExternalTicketSystemHasAnyFreePasswordsQuery,
} from '../queries/eventQuery';
import { getDateOptions, getTimeOptions } from '../EventUtils';
import {
  testEventId,
  testChildId,
  eventWithOccurrencesMock,
  externalTicketSystemEventMock,
  hasFreePasswordsMock,
  internalTicketSystemPasswordsMock,
  dummyPasswordMock,
} from '../__mocks__/eventMocks';

vi.mock('@sentry/browser');

const mockUseLocation = vi.hoisted(() =>
  vi.fn().mockReturnValue({
    pathname: '/profile/child/child-123/event/event-456',
  })
);

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({
      childId: 'child-123',
      eventId: 'event-456',
    }),
    useLocation: mockUseLocation,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../route/EventRoute', () => ({
  useEventRouteGoBackTo: () => '/profile/child/child-123',
}));

describe('Event', () => {
  // Test these utils separately so we do not need to mock the API.
  // Cover that with browser tests.
  describe('utilities', () => {
    it('getDateOptions should return a list of options without duplicates', () => {
      const occurrences = {
        edges: [
          { node: { id: '1', time: '2020-12-07' } },
          null,
          { node: { id: '1', time: '2020-12-07' } },
        ],
      };

      expect(getDateOptions(occurrences)).toMatchInlineSnapshot(`
        [
          {
            "key": "1",
            "label": "7.12.2020",
            "value": "2020-12-07",
          },
        ]
      `);
    });

    it('getTimeOptions should return an ordered list without duplicates', () => {
      const occurrences = {
        edges: [
          {
            node: {
              id: '1',
              time: new Date(2020, 11, 7, 10),
              event: { duration: 10 },
            },
          },
          null,
          {
            node: {
              id: '1',
              time: new Date(2020, 11, 7, 10),
              event: { duration: 10 },
            },
          },
          {
            node: {
              id: '1',
              time: new Date(2020, 11, 7, 8),
              event: { duration: 15 },
            },
          },
        ],
      };

      expect(getTimeOptions(occurrences)).toMatchInlineSnapshot(`
        [
          {
            "key": "1",
            "label": "08:00 - 08:15",
            "value": "08:00",
          },
          {
            "key": "1",
            "label": "10:00 - 10:10",
            "value": "10:00",
          },
        ]
      `);
    });
  });

  describe('Event component', () => {
    const renderEvent = (mocks) => render(<Event />, mocks);

    const waitForLoadingToFinish = () =>
      waitFor(() => {
        expect(screen.queryByLabelText('Lataa')).not.toBeInTheDocument();
      });

    beforeEach(() => {
      vi.clearAllMocks();
      mockUseLocation.mockReturnValue({
        pathname: '/profile/child/child-123/event/event-456',
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('displays error message when event query fails', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const errorMock = {
        request: {
          query: eventQuery,
          variables: {
            id: testEventId,
            childId: testChildId,
          },
        },
        error: new Error('Query failed'),
      };

      renderEvent([errorMock, dummyPasswordMock]);

      expect(await screen.findByText(/Tapahtui virhe/i)).toBeInTheDocument();
      expect(Sentry.captureException).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('displays "No event" when event data is missing', async () => {
      const noEventMock = {
        request: {
          query: eventQuery,
          variables: {
            id: testEventId,
            childId: testChildId,
          },
        },
        newData: () => ({
          data: {
            event: null,
          },
        }),
      };

      renderEvent([noEventMock, dummyPasswordMock]);

      expect(await screen.findByText('No event')).toBeInTheDocument();
    });

    it('renders event details for internal ticket system', async () => {
      renderEvent([eventWithOccurrencesMock, internalTicketSystemPasswordsMock]);

      await waitForLoadingToFinish();

      // Verify event details are rendered with actual EventPage component
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('Test event description')).toBeInTheDocument();
    });

    it('renders EventEnrol component for internal ticket system on upcoming events', async () => {
      renderEvent([eventWithOccurrencesMock, internalTicketSystemPasswordsMock]);

      await waitForLoadingToFinish();

      // Verify EventEnrol component is rendered by checking for its form fields
      expect(screen.getByLabelText(/Valitse päivämäärä/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Valitse kellonaika/i)).toBeInTheDocument();
    });

    it('does not render EventEnrol on past events', async () => {
      mockUseLocation.mockReturnValue({
        pathname: '/profile/child/child-123/event/event-456/past',
      });

      renderEvent([
        eventWithOccurrencesMock,
        internalTicketSystemPasswordsMock,
      ]);

      await waitForLoadingToFinish();

      expect(
        screen.queryByLabelText(/Valitse päivämäärä/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/Valitse kellonaika/i)
      ).not.toBeInTheDocument();
    });

    it('renders Continue button for external ticket system when can enroll and has free passwords', async () => {
      renderEvent([externalTicketSystemEventMock, hasFreePasswordsMock]);

      await waitForLoadingToFinish();

      expect(
        screen.getByText(/Jatka ilmoittautumaan/i)
      ).toBeInTheDocument();
    });

    it('renders no free passwords text for external ticket system when passwords are exhausted', async () => {
      const noFreePasswordsMock = {
        request: {
          query: eventExternalTicketSystemHasAnyFreePasswordsQuery,
          variables: {
            id: testEventId,
          },
        },
        newData: () => ({
          data: {
            event: {
              __typename: 'EventNode',
              id: testEventId,
              ticketSystem: {
                __typename: 'TicketmasterEventTicketSystem',
                type: 'TICKETMASTER',
                hasAnyFreePasswords: false,
              },
            },
          },
        }),
      };

      renderEvent([externalTicketSystemEventMock, noFreePasswordsMock]);

      await waitForLoadingToFinish();

      expect(
        screen.getByText(/Valitettavasti salasanoja ei ole enää jäljellä/i)
      ).toBeInTheDocument();
    });

    it('renders cant enroll notification for external ticket system when enrollment is not allowed', async () => {
      const cannotEnrollExternalEventMock = {
        request: {
          query: eventQuery,
          variables: {
            id: testEventId,
            childId: testChildId,
          },
        },
        newData: () => ({
          data: {
            event: {
              __typename: 'EventNode',
              id: testEventId,
              name: 'External Ticket Event',
              description: 'Event with external ticket system',
              shortDescription: 'External short description',
              image: 'external-image-url',
              imageAltText: 'External image alt',
              participantsPerInvite: 'CHILD_AND_GUARDIAN',
              duration: 60,
              capacityPerOccurrence: 20,
              canChildEnroll: false,
              eventGroup: {
                __typename: 'EventGroupNode',
                id: 'group-123',
              },
              ticketSystem: {
                __typename: 'TicketmasterEventTicketSystem',
                type: 'TICKETMASTER',
                childPassword: 'test-password',
                url: 'https://ticketmaster.example',
              },
              allOccurrences: {
                __typename: 'OccurrenceNodeConnection',
                edges: [],
              },
              occurrences: {
                __typename: 'OccurrenceNodeConnection',
                edges: [],
              },
            },
          },
        }),
      };

      renderEvent([cannotEnrollExternalEventMock, hasFreePasswordsMock]);

      await waitForLoadingToFinish();

      expect(
        screen.getByText(
          /Huomioithan, että et voi ilmoittautua tähän tapahtumaan/i
        )
      ).toBeInTheDocument();
    });
  });
});
