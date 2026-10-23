// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// FIXME: Fix types and re-enable Typescript checking by removing @ts-nocheck
import { vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
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

      // Verify event details and description
      expect(
        screen.getByRole('heading', { level: 1, name: 'Test Event' })
      ).toBeInTheDocument();
      expect(screen.getByText('Test event description')).toBeInTheDocument();

      // Verify breadcrumbs
      expect(
        screen.getByRole('navigation', { name: /Leivänmurunavigaatio/i })
      ).toBeInTheDocument();

      // Verify sidebar Osallistujat section is rendered
      expect(screen.getByText('Osallistujat')).toBeInTheDocument();

      // In event-level mode: Hero link and sidebar button jump to table, table is rendered, other occurrences list is hidden
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
      expect(
        screen.queryByText('Tapahtuman muut ajat')
      ).not.toBeInTheDocument();

      // Verify occurrence table dropdowns are not rendered
      expect(
        screen.queryByLabelText(/Valitse päivämäärä/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/Valitse kellonaika/i)
      ).not.toBeInTheDocument();
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
        occurrenceLanguage: 'FI',
        childHasFreeSpotNotificationSubscription: false,
        venue: {
          id: 'v-1',
          name: 'Kaapelitehdas',
          address: 'Tallberginkatu 1',
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
              canChildEnroll: true,
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

      // Verify event-level hero button jumps to occurrences table
      expect(
        screen.getByRole('link', {
          name: 'Katso tapahtuma-ajat ja ilmoittaudu',
        })
      ).toBeInTheDocument();

      // Table on bottom IS rendered
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'Tapahtuman ajankohdat ja ilmoittautuminen',
        })
      ).toBeInTheDocument();

      // Verify breadcrumb does NOT link event name and does NOT append occurrence datetime
      expect(screen.queryByRole('link', { name: 'Test Event' })).not.toBeInTheDocument();
      expect(screen.queryByText('To 15.10.2026, 15:00')).not.toBeInTheDocument();

      // Verify sidebar does NOT contain link to event page or other occurrences
      expect(screen.queryByText('Tapahtuma')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'Siirry tapahtumasivulle' })
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Tapahtuman muut ajat')).not.toBeInTheDocument();
    });
  });
});
