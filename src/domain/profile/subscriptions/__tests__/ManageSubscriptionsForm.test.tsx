import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import ManageSubscriptionsForm from '../ManageSubscriptionsForm';
import { UpdateMyCommunicationSubscriptionsDocument } from '../../../api/generatedTypes/graphql';

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@sentry/browser', () => ({ captureException: vi.fn() }));

// The component passes client: graphqlClient to useMutation; setting it to
// undefined makes Apollo fall back to MockedProvider's context client.
vi.mock('../../../api/client', () => ({ default: undefined }));

const defaultInitialValues = {
  hasAcceptedCommunication: true,
  authToken: null,
};

const getSubmitButton = () =>
  screen.getByRole('button', { name: 'Tallenna valinnat' });

const successMock: MockedResponse = {
  request: {
    query: UpdateMyCommunicationSubscriptionsDocument,
    variables: {
      input: { hasAcceptedCommunication: true, authToken: null },
    },
  },
  result: {
    data: {
      updateMyCommunicationSubscriptions: {
        guardian: {
          firstName: 'Test',
          lastName: 'User',
          language: 'fi',
          hasAcceptedCommunication: true,
        },
      },
    },
  },
};

const errorMock: MockedResponse = {
  request: {
    query: UpdateMyCommunicationSubscriptionsDocument,
    variables: {
      input: { hasAcceptedCommunication: true, authToken: null },
    },
  },
  error: new Error('Network error'),
};

function renderForm(mocks: MockedResponse[], initialValues = defaultInitialValues) {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ManageSubscriptionsForm initialValues={initialValues} />
    </MockedProvider>
  );
}

describe('ManageSubscriptionsForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the checkbox and submit button', () => {
    renderForm([]);
    expect(
      screen.getByRole('checkbox', {
        name: 'Haluan viestejä uusista kummitapahtumista',
      })
    ).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it('shows a success toast after a successful mutation', async () => {
    const user = userEvent.setup();
    renderForm([successMock]);

    await user.click(getSubmitButton());

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        'Tiedot tallennettu.'
      )
    );
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('shows an error toast and captures exception when mutation fails', async () => {
    const user = userEvent.setup();
    renderForm([errorMock]);

    await user.click(getSubmitButton());

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Tapahtui virhe tietojen tallennuksessa. Yritä myöhemmin uudestaan.'
      )
    );
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    expect(toast.success).not.toHaveBeenCalled();
  });
});
