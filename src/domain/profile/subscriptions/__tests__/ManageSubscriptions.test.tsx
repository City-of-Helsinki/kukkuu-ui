import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { toast } from 'react-toastify';
import { MemoryRouter } from 'react-router-dom';
import { useOidcClient } from 'hds-react';
import { HelmetProvider } from 'react-helmet-async';

import ManageSubscriptions from '../ManageSubscriptions';
import { MyCommunicationSubscriptionsDocument } from '../../../api/generatedTypes/graphql';

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
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

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));
vi.mock('hds-react', async () => ({
  ...(await vi.importActual<object>('hds-react')),
  useOidcClient: vi.fn(),
}));

describe('ManageSubscriptions', () => {
  const createMock = ({
    withData = true,
    withError = false,
    isAuthenticated = true,
  }: {
    withData?: boolean;
    withError?: boolean;
    isAuthenticated?: boolean;
  }) => {
    const myCommunicationSubscriptions = withData
      ? {
          firstName: 'Test',
          hasAcceptedCommunication: true,
          lastName: 'Guy',
          language: 'fi',
        }
      : undefined;

    vi.mocked(useOidcClient).mockReturnValue({
      isAuthenticated: () => isAuthenticated,
    } as any);

    return [
      {
        request: {
          query: MyCommunicationSubscriptionsDocument,
          variables: { authToken: null },
        },
        ...(withError
          ? {
              error: new Error('Error'),
            }
          : {
              result: {
                data: {
                  myCommunicationSubscriptions,
                },
              },
            }),
      },
    ];
  };

  const renderComponent = (mocks: any, initialEntries?: string[]) =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <HelmetProvider>
            <MemoryRouter initialEntries={initialEntries}>
              <ManageSubscriptions />
            </MemoryRouter>
          </HelmetProvider>
        </I18nextProvider>
      </MockedProvider>
    );

  it('renders title and description', async () => {
    const mocks = createMock({});
    renderComponent(mocks);

    await waitFor(() => {
      expect(
        screen.getByText('subscriptions.manage.title')
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText('subscriptions.manage.description')
    ).toBeInTheDocument();
  });

  it('renders the ManageSubscriptionsForm', async () => {
    const mocks = createMock({});
    const { container } = renderComponent(mocks);

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    expect(screen.getByText('subscriptions.manage.title')).toBeInTheDocument();
    expect(
      screen.getByText('subscriptions.manage.description')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('checkbox', {
        name: 'subscriptions.manage.form.fields.hasAcceptedCommunication.label',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'subscriptions.manage.form.submit.button.label',
      })
    ).toBeInTheDocument();
  });

  it('shows error toast if there is an error and user is logged in', async () => {
    const mocks = createMock({ withError: true, isAuthenticated: true });
    renderComponent(mocks);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'subscriptions.manage.form.query.authenticatedErrorMessage',
        {
          toastId: 'MyCommunicationSubscriptionsQuery',
          delay: 3000,
          autoClose: false,
        }
      );
    });
  });
});
