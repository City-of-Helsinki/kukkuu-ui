import { toast } from 'react-toastify';
import { MockedResponse } from '@apollo/client/testing';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import * as Sentry from '@sentry/browser';

import { handleEnrolCompleted } from '../handleEnrolCompleted';
import { customRender as render } from '../../../../common/test/customRender';
import EnrolPage from '../EnrolPage';
import occurrenceQuery from '../../queries/occurrenceQuery';
import enrolOccurrenceMutation from '../../mutations/enrolOccurrenceMutation';
import { testChildId } from '../../../child/__mocks__/childMocks';
import {
  testOccurrenceId,
  occurrenceData,
  occurrenceWithDataMock,
} from '../../__mocks__/occurrenceMocks';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('@sentry/browser');
vi.mock('../../../api/client', () => ({ default: undefined }));
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

    expect(
      await screen.findByRole('button', { name: /Ilmoittaudu/i })
    ).toBeInTheDocument();
  });

  it('displays error message on query error', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

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

    expect(
      await screen.findByText(/Tapahtui virhe. Yritä myöhemmin uudestaan/i)
    ).toBeInTheDocument();
    expect(Sentry.captureException).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('shows a toast with registration opening time when enrolling and registration is not open', async () => {
    const user = userEvent.setup();
    const registrationOpensAt = '2099-06-01T10:00:00+03:00';
    const occurrenceMock: MockedResponse = {
      ...occurrenceWithDataMock,
      result: {
        data: {
          occurrence: {
            ...occurrenceData,
            event: { ...occurrenceData.event, registrationOpensAt },
          },
        },
      },
    };
    const enrolErrorMock = {
      request: {
        query: enrolOccurrenceMutation,
        variables: {
          input: { occurrenceId: testOccurrenceId, childId: testChildId },
        },
      },
      result: {
        errors: [
          new GraphQLError('Event registration has not opened yet', {
            extensions: { code: 'REGISTRATION_NOT_OPEN_ERROR' },
          }),
        ],
      },
    } as never;

    renderEnrolPage([occurrenceMock, enrolErrorMock]);

    await user.click(
      await screen.findByRole('button', { name: /Ilmoittaudu/i })
    );

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(
        'Ilmoittautuminen alkaa 1.6.2099 klo 10:00'
      );
    });
  });

  it('shows generic not-opened-yet toast on REGISTRATION_NOT_OPEN_ERROR without opening time', async () => {
    const user = userEvent.setup();
    const enrolErrorMock = {
      request: {
        query: enrolOccurrenceMutation,
        variables: {
          input: { occurrenceId: testOccurrenceId, childId: testChildId },
        },
      },
      result: {
        errors: [
          new GraphQLError('Event registration has not opened yet', {
            extensions: { code: 'REGISTRATION_NOT_OPEN_ERROR' },
          }),
        ],
      },
    } as never;

    renderEnrolPage([occurrenceWithDataMock, enrolErrorMock]);

    await user.click(
      await screen.findByRole('button', { name: /Ilmoittaudu/i })
    );

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(
        'Ilmoittautuminen ei ole vielä alkanut'
      );
    });
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
