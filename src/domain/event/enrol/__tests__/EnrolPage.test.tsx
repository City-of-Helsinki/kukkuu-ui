import { toast } from 'react-toastify';

import { handleEnrolCompleted } from '../handleEnrolCompleted';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
  },
}));

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
