import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender as render } from '../../../../common/test/customRender';
import UnenrolModal from '../UnenrolModal';
import unenrolOccurrenceMutation from '../../mutations/unenrolOccurrenceMutation';
import { testChildId } from '../../__mocks__/eventMocks';
import { testOccurrenceId } from '../../__mocks__/occurrenceMocks';
import { handleUnenrolCompleted } from '../handleUnenrolCompleted';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../../app/AppConfig', () => ({
  default: { enrolmentCancellationTimeLimitHours: 48 },
}));

vi.mock('../../api/client', () => ({ default: undefined }));
vi.mock('../../../api/client', () => ({ default: undefined }));

vi.mock('../../getEventOrEventGroupOccurrenceRefetchQueries', () => ({
  default: () => [],
}));

vi.mock('../../../profile/hooks/useProfileContext', () => ({
  useProfileContext: () => ({
    profile: null,
    refetchProfile: vi.fn().mockResolvedValue(undefined),
    clearProfile: vi.fn(),
    updateProfile: vi.fn(),
    isLoading: false,
    isFetchCalled: true,
  }),
}));

vi.mock('../../../profile/ProfileProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

const defaultProps = {
  isOpen: true,
  setIsOpen: vi.fn(),
  childId: testChildId,
  occurrenceId: testOccurrenceId,
};

const successMock = {
  request: {
    query: unenrolOccurrenceMutation,
    variables: {
      input: { occurrenceId: testOccurrenceId, childId: testChildId },
    },
  },
  result: {
    data: {
      unenrolOccurrence: {
        clientMutationId: null,
        occurrence: { id: testOccurrenceId, event: { id: 'event-1' } },
        child: {
          id: testChildId,
          availableEvents: { edges: [] },
          occurrences: { edges: [] },
          pastEvents: { edges: [] },
        },
      },
    },
  },
};

describe('UnenrolModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal heading and cancellation description', () => {
    render(<UnenrolModal {...defaultProps} />, []);

    expect(
      screen.getByText(
        'Haluatko varmasti perua tapahtumaan ilmoittautumisen?'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/peru ilmoittautumisenne viimeistään 48 tuntia/i)
    ).toBeInTheDocument();
  });

  it('calls setIsOpen(false) when cancel button is clicked', async () => {
    const setIsOpen = vi.fn();
    const user = userEvent.setup();
    render(<UnenrolModal {...defaultProps} setIsOpen={setIsOpen} />, []);

    await user.click(
      screen.getByRole('button', { name: 'Palaa tapahtuman sivulle' })
    );

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it('calls unenrol mutation when confirm button is clicked', async () => {
    const user = userEvent.setup();
    render(<UnenrolModal {...defaultProps} />, [successMock]);

    await user.click(
      screen.getByRole('button', { name: 'Peru ilmoittautuminen' })
    );

    await waitFor(() => {
      expect(screen.queryByLabelText('Lataa')).not.toBeInTheDocument();
    });
  });

  it('does not render when isOpen is false', () => {
    render(<UnenrolModal {...defaultProps} isOpen={false} />, []);

    expect(
      screen.queryByText(
        'Haluatko varmasti perua tapahtumaan ilmoittautumisen?'
      )
    ).not.toBeInTheDocument();
  });
});

describe('handleUnenrolCompleted', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches when occurrences exist', async () => {
    const dispatch = vi.fn();
    const refetchProfile = vi.fn().mockResolvedValue(undefined);
    const navigateToProfile = vi.fn();

    await handleUnenrolCompleted(
      {
        unenrolOccurrence: {
          child: {
            id: 'child-1',
            occurrences: {
              edges: [{ node: { id: 'o1' } }],
            },
          },
        },
      } as any,
      {
        dispatch,
        refetchProfile,
        navigateToProfile,
      }
    );

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(refetchProfile).toHaveBeenCalledTimes(1);
    expect(navigateToProfile).toHaveBeenCalledTimes(1);
  });

  it('still refetches and navigates when occurrences are empty', async () => {
    const dispatch = vi.fn();
    const refetchProfile = vi.fn().mockResolvedValue(undefined);
    const navigateToProfile = vi.fn();

    await handleUnenrolCompleted(
      {
        unenrolOccurrence: {
          child: {
            id: 'child-1',
            occurrences: {
              edges: null,
            },
          },
        },
      } as any,
      {
        dispatch,
        refetchProfile,
        navigateToProfile,
      }
    );

    expect(dispatch).not.toHaveBeenCalled();
    expect(refetchProfile).toHaveBeenCalledTimes(1);
    expect(navigateToProfile).toHaveBeenCalledTimes(1);
  });
});