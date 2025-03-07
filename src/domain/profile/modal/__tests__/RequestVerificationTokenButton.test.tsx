import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { toast } from 'react-toastify';
import React, { act } from 'react';

import RequestVerificationTokenButton from '../RequestVerificationTokenButton';
import requestEmailUpdateTokenMutation from '../../mutations/requestEmailUpdateTokenMutation';

vi.mock('react-i18next', async (importActual) => {
  const actual = (await importActual()) as any;
  return {
    ...actual,
    useTranslation: () => ({
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }),
  };
});

vi.mock('react-toastify', async (importActual) => {
  const actual = (await importActual()) as any;
  return {
    ...actual,
    toast: {
      ...actual.toast,
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

vi.mock('@sentry/browser', async () => ({
  captureException: vi.fn(),
}));

describe('RequestVerificationTokenButton', () => {
  const email = 'test@example.com';
  const successMessage =
    'registration.form.guardian.email.verificationToken.request.successful';
  const errorMessage =
    'registration.form.guardian.email.verificationToken.request.error';
  const buttonText =
    'registration.form.guardian.email.verificationToken.request.button';

  type MockProps = {
    success: boolean;
    mutationCalledFunc?: ReturnType<typeof vi.fn>;
    delayMs?: number;
  };

  const createMock = ({ success, mutationCalledFunc, delayMs }: MockProps) => {
    return [
      {
        request: {
          query: requestEmailUpdateTokenMutation,
          variables: {
            input: {
              email,
            },
          },
        },
        delay: delayMs,
        result: () => {
          if (mutationCalledFunc) mutationCalledFunc();
          return {
            data: success
              ? {
                  requestEmailUpdateToken: {
                    success: true,
                    email: 'testguy@kukkuu.hel.fi',
                    emailUpdateTokenRequested: true,
                  },
                }
              : undefined,
            errors: success ? undefined : [{ message: 'Error' }],
          };
        },
      },
    ];
  };

  const getMockedProviders =
    (mocks: any[]) =>
    // eslint-disable-next-line react/display-name
    ({ children }: { children: React.ReactNode }) => {
      return (
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        </MockedProvider>
      );
    };

  it('renders button with correct text', async () => {
    const mocks = createMock({ success: true });
    render(<RequestVerificationTokenButton email={email} />, {
      wrapper: getMockedProviders(mocks),
    });
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: buttonText })
      ).toBeInTheDocument();
    });
  });

  it('calls mutation and displays success toast on button click', async () => {
    const mutationCalledFunc = vi.fn();
    const mocks = createMock({ success: true, mutationCalledFunc });
    render(<RequestVerificationTokenButton email={email} />, {
      wrapper: getMockedProviders(mocks),
    });

    expect(mutationCalledFunc).not.toHaveBeenCalled();

    const button = screen.getByRole('button', { name: buttonText });
    fireEvent.click(button);

    await waitFor(() => expect(mutationCalledFunc).toHaveBeenCalled());
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(successMessage)
    );
  });

  it('calls mutation and displays error toast on mutation error', async () => {
    const mutationCalledFunc = vi.fn();
    const mocks = createMock({ success: false, mutationCalledFunc });
    render(<RequestVerificationTokenButton email={email} />, {
      wrapper: getMockedProviders(mocks),
    });

    expect(mutationCalledFunc).not.toHaveBeenCalled();

    const button = screen.getByRole('button', { name: buttonText });
    fireEvent.click(button);

    await waitFor(() => expect(mutationCalledFunc).toHaveBeenCalled());
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(errorMessage));
  });

  it('button is disabled while loading', async () => {
    const mocks = createMock({
      success: true,
      delayMs: 5_000, // add delay to ensure the query is loading
    });
    render(<RequestVerificationTokenButton email={email} />, {
      wrapper: getMockedProviders(mocks),
    });

    const button = screen.getByRole('button', { name: buttonText });
    fireEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
  });

  it('disables button when disabled prop is true', async () => {
    const mocks = createMock({ success: true });
    render(<RequestVerificationTokenButton email={email} disabled={true} />, {
      wrapper: getMockedProviders(mocks),
    });

    const button = screen.getByRole('button', { name: buttonText });
    expect(button).toBeDisabled();
  });

  it('shows cool down timer and disables/re-enables the button', async () => {
    vi.useFakeTimers();

    const mocks = createMock({ success: true });
    render(<RequestVerificationTokenButton email={email} />, {
      wrapper: getMockedProviders(mocks),
    });

    const button = screen.getByRole('button', { name: buttonText });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button.textContent).toBe(buttonText);

    await act(async () => await vi.advanceTimersToNextTimerAsync());

    expect(button.textContent).toBe(`${buttonText} (60)`);
    expect(button).toBeDisabled();

    // Need to advance timer by 1s at a time because
    // useCoolDown uses setInterval with 1s intervals to update the cool down seconds
    // that affect the button text.
    for (let i = 59; i >= 1; i = i - 1) {
      await act(async () => await vi.advanceTimersByTimeAsync(1000));
      expect(button.textContent).toBe(`${buttonText} (${i})`);
      expect(button).toBeDisabled();
    }
    expect(button.textContent).toBe(`${buttonText} (1)`);
    expect(button).toBeDisabled();

    await act(async () => await vi.advanceTimersByTimeAsync(1000));
    expect(button.textContent).toBe(buttonText);
    expect(button).not.toBeDisabled();

    vi.useRealTimers();
  });
});
