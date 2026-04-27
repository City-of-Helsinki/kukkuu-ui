import { toast } from 'react-toastify';
import { MockedResponse } from '@apollo/client/testing';
import { screen, waitFor } from '@testing-library/react';
import * as Sentry from '@sentry/browser';

import { handleEnrolCompleted } from '../handleEnrolCompleted';
import { customRender as render } from '../../../../common/test/customRender';
import EnrolPage from '../EnrolPage';
import occurrenceQuery from '../../queries/occurrenceQuery';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@sentry/browser');
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({
      childId: 'child-123',
      eventId: 'event-456',
      occurrenceId: 'occurrence-789',
    }),
    useNavigate: () => vi.fn(),
  };
});

const testOccurrenceId = 'occurrence-789';
const testChildId = 'child-123';

const occurrenceWithDataMock: MockedResponse = {
  request: {
    query: occurrenceQuery,
    variables: {
      id: testOccurrenceId,
      childId: testChildId,
    },
  },
  result: {
    data: {
      occurrence: {
        __typename: 'OccurrenceNode',
        id: testOccurrenceId,
        time: '2025-05-15T10:00:00+00:00',
        remainingCapacity: 10,
        event: {
          __typename: 'EventNode',
          id: 'event-456',
          image: 'image-url',
          imageAltText: 'Test Event Image',
          description: 'Test Event Description',
          shortDescription: 'Test Short Description',
          name: 'Test Event',
          duration: 60,
          participantsPerInvite: 1,
          eventGroup: {
            __typename: 'EventGroupNode',
            id: 'group-123',
          },
        },
        venue: {
          __typename: 'VenueNode',
          id: 'venue-123',
          name: 'Test Venue',
          address: 'Test Address 123',
          accessibilityInfo: 'Accessible',
          arrivalInstructions: 'Come early',
          additionalInfo: 'Extra info',
          wwwUrl: 'https://example.com',
          wcAndFacilities: 'Has facilities',
        },
        childHasFreeSpotNotificationSubscription: false,
      },
    },
  },
};

const renderEnrolPage = (mocks: MockedResponse[]) =>
  render(<EnrolPage />, mocks);

describe('EnrolPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Enrol component when data loads successfully', async () => {
    renderEnrolPage([occurrenceWithDataMock]);

    // Wait for the "no data" message to disappear
    await waitFor(() => {
      expect(screen.queryByText('no data')).not.toBeInTheDocument();
    });

    // Verify Enrol component renders (check for enrollment button)
    const enrollButton = screen.getByRole('button', { name: /Ilmoittaudu/i });
    expect(enrollButton).toBeInTheDocument();
  });

  it('displays error message on query error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const errorMock: MockedResponse = {
      request: {
        query: occurrenceQuery,
        variables: {
          id: testOccurrenceId,
          childId: testChildId,
        },
      },
      error: new Error('Query failed'),
    };

    renderEnrolPage([errorMock]);

    expect(await screen.findByText(/Tapahtui virhe. Yritä myöhemmin uudestaan/i)).toBeInTheDocument();
    expect(Sentry.captureException).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('displays no data message when occurrence data is missing', async () => {
    const noDataMock: MockedResponse = {
      request: {
        query: occurrenceQuery,
        variables: {
          id: testOccurrenceId,
          childId: testChildId,
        },
      },
      result: {
        data: {
          occurrence: null,
        },
      },
    };

    renderEnrolPage([noDataMock]);

    expect(await screen.findByText('no data')).toBeInTheDocument();
  });
});

describe('handleEnrolCompleted', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches and shows success toast when occurrences exist', async () => {
    const dispatch = vi.fn();
    const refetchProfile = vi.fn().mockResolvedValue(undefined);
    const goToOccurrence = vi.fn();

    await handleEnrolCompleted(
      {
        enrolOccurrence: {
          enrolment: {
            child: {
              occurrences: {
                edges: [{ node: { id: 'o1' } }],
              },
            },
          },
        },
      } as any,
      {
        childId: 'child-1',
        dispatch,
        refetchProfile,
        goToOccurrence,
        t: (key) => key,
      }
    );

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(refetchProfile).toHaveBeenCalledTimes(1);
    expect(goToOccurrence).toHaveBeenCalledTimes(1);
  });

  it('refetches and navigates even without occurrences', async () => {
    const dispatch = vi.fn();
    const refetchProfile = vi.fn().mockResolvedValue(undefined);
    const goToOccurrence = vi.fn();

    await handleEnrolCompleted(
      {
        enrolOccurrence: {
          enrolment: {
            child: {
              occurrences: null,
            },
          },
        },
      } as any,
      {
        childId: 'child-1',
        dispatch,
        refetchProfile,
        goToOccurrence,
        t: (key) => key,
      }
    );

    expect(dispatch).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(refetchProfile).toHaveBeenCalledTimes(1);
    expect(goToOccurrence).toHaveBeenCalledTimes(1);
  });
});