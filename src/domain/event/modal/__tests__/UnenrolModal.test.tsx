import { handleUnenrolCompleted } from '../handleUnenrolCompleted';

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
