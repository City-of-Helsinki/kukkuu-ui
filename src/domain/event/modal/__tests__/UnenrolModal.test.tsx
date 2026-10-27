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
    profile: {
      id: 'profile-1',
      firstName: 'Maija',
      lastName: 'Meikäläinen',
      children: {
        edges: [
          {
            node: {
              id: testChildId,
              name: 'Emma',
              enrolments: {
                edges: [
                  {
                    node: {
                      id: 'enrolment-1',
                      occurrence: {
                        id: testOccurrenceId,
                        time: '2028-09-19T14:00:00Z',
                        event: {
                          id: 'event-1',
                          name: 'Nukketeatteri Sampo: Pieni yösoitto',
                        },
                        venue: {
                          id: 'venue-1',
                          name: 'Pakilantie 12 B',
                          address: 'Helsinki',
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
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
  occurrence: {
    id: testOccurrenceId,
    time: '2028-09-19T14:00:00Z',
    venue: {
      id: 'venue-1',
      name: 'Pakilantie 12 B',
      address: 'Helsinki',
    },
    event: {
      id: 'event-1',
      name: 'Nukketeatteri Sampo: Pieni yösoitto',
      duration: 90,
    },
  },
  event: {
    id: 'event-1',
    name: 'Nukketeatteri Sampo: Pieni yösoitto',
    duration: 90,
  },
};

describe('UnenrolModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal heading, prompt, card details, and buttons', () => {
    render(<UnenrolModal {...defaultProps} />, []);

    expect(
      screen.getByRole('heading', { name: 'Peruuta ilmoittautuminen' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Oletko varma, että haluat peruuttaa ilmoittautumisesi tapahtumaan?'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Nukketeatteri Sampo: Pieni yösoitto')
    ).toBeInTheDocument();
    expect(screen.getByText('Ilmoittautunut: Emma')).toBeInTheDocument();
    expect(screen.getByText(/Pakilantie 12 B, Helsinki/)).toBeInTheDocument();
    expect(screen.getByText('Emma')).toBeInTheDocument();
    expect(screen.getByText('Maija Meikäläinen')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Katso tapahtuma-ajan tiedot/ })
    ).toHaveAttribute(
      'href',
      `/profile/child/${testChildId}/event/event-1`
    );
    expect(
      screen.getByRole('button', { name: 'Peruuta ilmoittautuminen' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Säilytä ilmoittautuminen' })
    ).toBeInTheDocument();
  });

  it('calls setIsOpen(false) when keep button is clicked', async () => {
    const setIsOpen = vi.fn();
    const user = userEvent.setup();
    render(<UnenrolModal {...defaultProps} setIsOpen={setIsOpen} />, []);

    await user.click(
      screen.getByRole('button', { name: 'Säilytä ilmoittautuminen' })
    );

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it('calls unenrol mutation when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const mutationResult = vi.fn(() => ({
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
    }));

    render(<UnenrolModal {...defaultProps} />, [
      {
        request: {
          query: unenrolOccurrenceMutation,
          variables: {
            input: { occurrenceId: testOccurrenceId, childId: testChildId },
          },
        },
        result: mutationResult,
      },
    ]);

    await user.click(
      screen.getByRole('button', { name: 'Peruuta ilmoittautuminen' })
    );

    await waitFor(() => {
      expect(mutationResult).toHaveBeenCalledTimes(1);
    });
  });

  it('does not render when isOpen is false', () => {
    render(<UnenrolModal {...defaultProps} isOpen={false} />, []);

    expect(
      screen.queryByText('Peruuta ilmoittautuminen')
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
