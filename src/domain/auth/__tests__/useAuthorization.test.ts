import { renderHook, waitFor } from '@testing-library/react';
import * as Sentry from '@sentry/browser';

import { useAuthorization } from '../useAuthorization';

vi.mock('@sentry/browser');

describe('useAuthorization', () => {
  it('returns the value directly when authorization is a boolean', () => {
    const { result: authorized } = renderHook(() => useAuthorization(true));
    expect(authorized.current).toEqual([false, true]);

    const { result: unauthorized } = renderHook(() => useAuthorization(false));
    expect(unauthorized.current).toEqual([false, false]);
  });

  it('grants authorization when the async check resolves to true', async () => {
    const authorization = vi.fn().mockResolvedValue(true);

    const { result } = renderHook(() => useAuthorization(authorization));

    // Loading while the check is pending
    expect(result.current).toEqual([true, false]);

    await waitFor(() => expect(result.current).toEqual([false, true]));
  });

  it('denies authorization when the async check resolves to false', async () => {
    const authorization = vi.fn().mockResolvedValue(false);

    const { result } = renderHook(() => useAuthorization(authorization));

    await waitFor(() => expect(result.current).toEqual([false, false]));
  });

  it('denies authorization and reports to Sentry when the check fails', async () => {
    const error = new Error('authorization check failed');
    const authorization = vi.fn().mockRejectedValue(error);

    const { result } = renderHook(() => useAuthorization(authorization));

    await waitFor(() => expect(result.current).toEqual([false, false]));
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });
});
