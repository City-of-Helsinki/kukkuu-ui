import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as Sentry from '@sentry/browser';

import ProfileProvider from '../ProfileProvider';
import { useProfileContext } from '../hooks/useProfileContext';
import useProfileFetcher from '../hooks/useProfileFetcher';

vi.mock('@sentry/browser', () => ({
  captureException: vi.fn(),
}));

vi.mock('../hooks/useProfileFetcher');

function Consumer() {
  const { profile, refetchProfile } = useProfileContext();

  return (
    <>
      <button onClick={() => void refetchProfile()}>refetch profile</button>
      <div>{profile?.firstName ?? 'no-profile'}</div>
    </>
  );
}

describe('ProfileProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates context profile after successful refetch', async () => {
    const refetch = vi.fn().mockResolvedValue({
      data: {
        myProfile: {
          id: 'guardian-1',
          firstName: 'Updated name',
        },
      },
    });

    vi.mocked(useProfileFetcher).mockReturnValue({
      refetch,
      loading: false,
      called: true,
    } as any);

    render(
      <ProfileProvider>
        <Consumer />
      </ProfileProvider>
    );

    fireEvent.click(screen.getByText('refetch profile'));

    await waitFor(() => {
      expect(screen.getByText('Updated name')).toBeInTheDocument();
    });
  });

  it('captures the error when refetch fails', async () => {
    const error = new Error('refetch failed');
    const refetch = vi.fn().mockRejectedValue(error);

    vi.mocked(useProfileFetcher).mockReturnValue({
      refetch,
      loading: false,
      called: true,
    } as any);

    render(
      <ProfileProvider>
        <Consumer />
      </ProfileProvider>
    );

    fireEvent.click(screen.getByText('refetch profile'));

    await waitFor(() => {
      expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });
  });
});
