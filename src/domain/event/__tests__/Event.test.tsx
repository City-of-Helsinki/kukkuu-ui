import { vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { MockedResponse } from '@apollo/client/testing';
import * as Sentry from '@sentry/browser';

import { customRender as render } from '../../../common/test/customRender';
import {
  fakeEventNode,
  fakeOccurrenceNode,
} from '../../../utils/eventMockDataUtils';
import Event from '../Event';
import eventQuery from '../queries/eventQuery';
import { getDateOptions, getTimeOptions } from '../EventUtils';
import {
  testEventId,
  testChildId,
  eventWithOccurrencesMock,
} from '../__mocks__/eventMocks';

vi.mock('@sentry/browser');

const mockUseLocation = vi.hoisted(() =>
  vi.fn().mockReturnValue({
    pathname: '/profile/child/child-123/event/event-456',
  })
);

const mockUseSearchParams = vi.hoisted(() =>
  vi.fn().mockReturnValue([new URLSearchParams(), vi.fn()])
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
    useSearchParams: mockUseSearchParams,
  };
});

describe('Event', () => {
  describe('utilities', () => {
    it('getDateOptions should return a list of options without duplicates', () => {
      const occurrences = {
        edges: [
          { node: { id: '1', time: '2020-12-07' } },
          null,
          { node: { id: '1', time: '2020-12-07' } },
        ],
      };

      expect(getDateOptions(occurrences as any)).toMatchInlineSnapshot(`
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

      expect(getTimeOptions(occurrences as any)).toMatchInlineSnapshot(`
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
    const renderEvent = (mocks: MockedResponse[]) => render(<Event />, mocks);

    const waitForLoadingToFinish = () =>
      waitFor(() => {
        expect(screen.queryByLabelText('Lataa')).not.toBeInTheDocument();
      });

    beforeEach(() => {
      vi.clearAllMocks();
      mockUseLocation.mockReturnValue({
        pathname: '/profile/child/child-123/event/event-456',
      });
      mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
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

      renderEvent([errorMock]);

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

      renderEvent([noEventMock]);

      expect(await screen.findByText('No event')).toBeInTheDocument();
    });

    it('renders event details, breadcrumbs, description and sidebar info', async () => {
      renderEvent([eventWithOccurrencesMock]);

      await waitForLoadingToFinish();

      expect(
        screen.getByRole('heading', { level: 1, name: 'Test Event' })
      ).toBeInTheDocument();
      expect(screen.getByText('Test event description')).toBeInTheDocument();

      expect(
        screen.getByRole('navigation', { name: /Leivänmurunavigaatio/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Tapahtumat' })
      ).toHaveAttribute('href', '/events?child=child-123');

      expect(screen.getByText('Osallistujat')).toBeInTheDocument();

      expect(
        screen.getByRole('link', {
          name: 'Katso tapahtuma-ajat ja ilmoittaudu',
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: 'Katso tapahtuma-ajat ja ilmoittaudu',
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'Tapahtuman ajankohdat ja ilmoittautuminen',
        })
      ).toBeInTheDocument();
    });

    it('renders event details page in standard event mode even when occurrenceId query param is present', async () => {
      mockUseSearchParams.mockReturnValue([
        new URLSearchParams('occurrenceId=occ-1'),
        vi.fn(),
      ]);

      const occurrenceNode = fakeOccurrenceNode({
        id: 'occ-1',
        time: '2026-10-15T12:00:00Z',
        remainingCapacity: 10,
        childHasFreeSpotNotificationSubscription: false,
        venue: {
          id: 'v-1',
          name: 'Kaapelitehdas',
          address: 'Tallberginkatu 1',
          description: null,
          accessibilityInfo: null,
          arrivalInstructions: null,
          wcAndFacilities: null,
          wwwUrl: null,
        },
        event: {
          id: testEventId,
          name: 'Test Event',
          duration: 60,
        },
      });

      const eventWithSingleOccurrenceMock = {
        request: {
          query: eventQuery,
          variables: {
            id: testEventId,
            childId: testChildId,
          },
        },
        result: {
          data: {
            event: fakeEventNode({
              id: testEventId,
              name: 'Test Event',
              description: 'Test event description',
              shortDescription: 'Test short description',
              image: 'test-image-url',
              imageAltText: 'Test image alt',
              duration: 60,
              capacityPerOccurrence: 20,
              enrolmentDeniedReason: null,
              registrationOpensAt: null,
              allOccurrences: {
                __typename: 'OccurrenceNodeConnection',
                edges: [
                  {
                    __typename: 'OccurrenceNodeEdge',
                    node: occurrenceNode,
                  },
                ],
              },
              occurrences: {
                __typename: 'OccurrenceNodeConnection',
                edges: [],
              },
            }),
          },
        },
      };

      renderEvent([eventWithSingleOccurrenceMock]);

      await waitForLoadingToFinish();

      expect(
        screen.getByRole('link', {
          name: 'Katso tapahtuma-ajat ja ilmoittaudu',
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'Tapahtuman ajankohdat ja ilmoittautuminen',
        })
      ).toBeInTheDocument();
    });

    const getEventWithDenialMock = ({
      enrolmentDeniedReason,
      registrationOpensAt = null,
    }: {
      enrolmentDeniedReason: string;
      registrationOpensAt?: string | null;
    }): MockedResponse => ({
      request: {
        query: eventQuery,
        variables: {
          id: testEventId,
          childId: testChildId,
        },
      },
      result: {
        data: {
          event: fakeEventNode({
            id: testEventId,
            name: 'Test Event',
            enrolmentDeniedReason: enrolmentDeniedReason as any,
            registrationOpensAt,
            allOccurrences: {
              __typename: 'OccurrenceNodeConnection',
              edges: [
                {
                  __typename: 'OccurrenceNodeEdge',
                  node: fakeOccurrenceNode(),
                },
              ],
            },
          }),
        },
      },
    });

    it('renders opening time notice when REGISTRATION_NOT_OPEN and opening time is in future', async () => {
      renderEvent([
        getEventWithDenialMock({
          enrolmentDeniedReason: 'REGISTRATION_NOT_OPEN',
          registrationOpensAt: '2099-06-01T10:00:00+03:00',
        }),
      ]);

      await waitForLoadingToFinish();

      expect(
        screen.getByText('Ilmoittautuminen alkaa 1.6.2099 klo 10:00')
      ).toBeInTheDocument();
    });

    it('renders generic not-opened-yet notice when REGISTRATION_NOT_OPEN without opening time', async () => {
      renderEvent([
        getEventWithDenialMock({
          enrolmentDeniedReason: 'REGISTRATION_NOT_OPEN',
        }),
      ]);

      await waitForLoadingToFinish();

      expect(
        screen.getByText('Ilmoittautuminen ei ole vielä alkanut')
      ).toBeInTheDocument();
    });

    it('renders cannot-enroll notice when EMPTY_EVENT and opening time is in future', async () => {
      renderEvent([
        getEventWithDenialMock({
          enrolmentDeniedReason: 'EMPTY_EVENT',
          registrationOpensAt: '2099-06-01T10:00:00+03:00',
        }),
      ]);

      await waitForLoadingToFinish();

      expect(
        screen.queryByText(/Ilmoittautuminen alkaa/i)
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(
          /Huomioithan, että et voi ilmoittautua tähän tapahtumaan/i
        )
      ).toBeInTheDocument();
    });
  });
});
