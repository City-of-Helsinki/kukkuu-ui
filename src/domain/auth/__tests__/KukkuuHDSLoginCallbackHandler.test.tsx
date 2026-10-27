import React from 'react';
import { screen } from '@testing-library/react';
import type { User } from 'hds-react';

import { customRender as render } from '../../../common/test/customRender';
import KukkuuHDSLoginCallbackHandler from '../KukkuuHDSLoginCallbackHandler';

const mockNavigate = vi.fn();
let capturedOnSuccess: ((user: User) => void) | undefined;

vi.mock('react-router', async (importOriginal: any) => {
  const mod = await importOriginal();
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('hds-react', async (importOriginal: any) => {
  const mod = await importOriginal();
  return {
    ...mod,
    LoginCallbackHandler: ({
      children,
      onSuccess,
    }: {
      children: React.ReactNode;
      onSuccess: (user: User) => void;
      onError?: (error?: any) => void;
    }) => {
      capturedOnSuccess = onSuccess;
      return <div data-testid="login-callback-handler">{children}</div>;
    },
  };
});

describe('KukkuuHDSLoginCallbackHandler', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    capturedOnSuccess = undefined;
  });

  it('renders login callback handler text', () => {
    render(<KukkuuHDSLoginCallbackHandler />);

    expect(
      screen.getByTestId('login-callback-handler')
    ).toBeInTheDocument();
  });

  it('navigates to /events on login success when url_state is not specified', () => {
    render(<KukkuuHDSLoginCallbackHandler />);

    expect(capturedOnSuccess).toBeDefined();
    capturedOnSuccess!({
      access_token: 'test-token',
    } as User);

    expect(mockNavigate).toHaveBeenCalledWith('/events', { replace: true });
  });

  it('navigates to specific next URL from url_state', () => {
    render(<KukkuuHDSLoginCallbackHandler />);

    expect(capturedOnSuccess).toBeDefined();
    capturedOnSuccess!({
      access_token: 'test-token',
      url_state: 'next=/registration/form',
    } as User);

    expect(mockNavigate).toHaveBeenCalledWith('/registration/form', {
      replace: true,
    });
  });

  it('redirects to /events even if url_state was legacy next=/profile', () => {
    render(<KukkuuHDSLoginCallbackHandler />);

    expect(capturedOnSuccess).toBeDefined();
    capturedOnSuccess!({
      access_token: 'test-token',
      url_state: 'next=/profile',
    } as User);

    expect(mockNavigate).toHaveBeenCalledWith('/events', { replace: true });
  });
});
