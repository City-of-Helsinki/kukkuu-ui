import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { toast } from 'react-toastify';
import React from 'react';

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

  const createMock = ({ success }: { success: boolean }) => {
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
        result: {
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
    const mocks = createMock({ success: true });
    render(<RequestVerificationTokenButton email={email} />, {
      wrapper: getMockedProviders(mocks),
    });

    const button = screen.getByRole('button', { name: buttonText });
    fireEvent.click(button);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(successMessage)
    );
  });

  it('calls mutation and displays error toast on mutation error', async () => {
    const mocks = createMock({ success: false });
    render(<RequestVerificationTokenButton email={email} />, {
      wrapper: getMockedProviders(mocks),
    });

    const button = screen.getByRole('button', { name: buttonText });
    fireEvent.click(button);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(errorMessage));
  });

  it('button not available while loading', async () => {
    const mocks = createMock({ success: true });
    render(<RequestVerificationTokenButton email={email} />, {
      wrapper: getMockedProviders(mocks),
    });

    const button = screen.getByRole('button', { name: buttonText });
    fireEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    // await waitFor(() => expect(button).not.toBeInTheDocument());
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
    expect(button).toHaveTextContent(`${buttonText}`);

    await vi.advanceTimersToNextTimerAsync();

    expect(button).toHaveTextContent(`${buttonText} (60)`);

    // eslint-disable-next-line no-plusplus
    for (let i = 59; i > 1; i--) {
      await vi.advanceTimersByTimeAsync(1000);
      expect(button).toHaveTextContent(`${buttonText} (${i})`);
    }

    await vi.advanceTimersByTimeAsync(1000);
    expect(button).toHaveTextContent(buttonText);

    await vi.advanceTimersByTimeAsync(1000);
    expect(button).not.toBeDisabled();

    vi.useRealTimers();
  });
});
