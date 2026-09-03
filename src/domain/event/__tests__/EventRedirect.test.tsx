import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { MockLink, MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import * as Sentry from '@sentry/browser';

import { customRender as render } from '../../../common/test/customRender';
import EventRedirect from '../EventRedirect';
import eventQuery, {
  eventExternalTicketSystemHasAnyFreePasswordsQuery,
  eventExternalTicketSystemPasswordQuery,
} from '../queries/eventQuery';
import assignTicketSystemPasswordMutation from '../mutations/assignTicketSystemPasswordMutation';
import { testChildId, testEventId } from '../__mocks__/eventMocks';

vi.mock('@sentry/browser');

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ childId: testChildId, eventId: testEventId }),
  };
});

// EventRedirect runs the assign-password mutation against the shared API client
// rather than the one from context, and clears that client's store in
// onCompleted. Give it a real client backed by MockLink so both work.
let apiClient: ApolloClient<object>;

vi.mock('../../api/client', () => ({
  get default() {
    return apiClient;
  },
}));

const TICKET_SYSTEM_URL = 'https://ticketmaster.example/event';
const ASSIGNED_PASSWORD = 'ASSIGNED-123';

const ticketSystem = (overrides: Record<string, unknown> = {}) => ({
  __typename: 'TicketmasterEventTicketSystem',
  type: 'TICKETMASTER',
  childPassword: null,
  url: TICKET_SYSTEM_URL,
  hasAnyFreePasswords: true,
  ...overrides,
});

const passwordQueryMock = (childPassword: string | null = null) => ({
  request: {
    query: eventExternalTicketSystemPasswordQuery,
    variables: { id: testEventId, childId: testChildId },
  },
  newData: () => ({
    data: {
      event: {
        __typename: 'EventNode',
        id: testEventId,
        participantsPerInvite: 'CHILD_AND_GUARDIAN',
        ticketSystem: ticketSystem({ childPassword }),
      },
    },
  }),
});

const eventQueryMock = (canChildEnroll = true) => ({
  request: {
    query: eventQuery,
    variables: { id: testEventId, childId: testChildId },
  },
  newData: () => ({
    data: {
      event: {
        __typename: 'EventNode',
        id: testEventId,
        name: 'Test Event',
        description: 'Test event description',
        shortDescription: 'Test short description',
        image: 'test-image-url',
        imageAltText: 'Test image alt',
        participantsPerInvite: 'CHILD_AND_GUARDIAN',
        duration: 60,
        capacityPerOccurrence: 20,
        canChildEnroll,
        eventGroup: { __typename: 'EventGroupNode', id: 'group-123' },
        ticketSystem: ticketSystem(),
        occurrences: {
          __typename: 'OccurrenceNodeConnection',
          edges: [],
        },
        allOccurrences: {
          __typename: 'OccurrenceNodeConnection',
          edges: [],
        },
      },
    },
  }),
});

const hasFreePasswordsMock = (hasAnyFreePasswords = true) => ({
  request: {
    query: eventExternalTicketSystemHasAnyFreePasswordsQuery,
    variables: { id: testEventId },
  },
  newData: () => ({
    data: {
      event: {
        __typename: 'EventNode',
        id: testEventId,
        ticketSystem: ticketSystem({ hasAnyFreePasswords }),
      },
    },
  }),
});

const defaultMocks = ({
  childPassword = null,
  canChildEnroll = true,
  hasAnyFreePasswords = true,
}: {
  childPassword?: string | null;
  canChildEnroll?: boolean;
  hasAnyFreePasswords?: boolean;
} = {}) => [
  passwordQueryMock(childPassword),
  eventQueryMock(canChildEnroll),
  hasFreePasswordsMock(hasAnyFreePasswords),
];

const assignMutationMock: MockedResponse = {
  request: {
    query: assignTicketSystemPasswordMutation,
    variables: {
      input: {
        eventId: testEventId,
        childId: testChildId,
        clientMutationId: null,
      },
    },
  },
  result: {
    data: {
      assignTicketSystemPassword: {
        __typename: 'AssignTicketSystemPasswordMutationPayload',
        password: ASSIGNED_PASSWORD,
      },
    },
  },
};

const passwordQueryErrorMock = (error: GraphQLError) =>
  ({
    request: {
      query: eventExternalTicketSystemPasswordQuery,
      variables: { id: testEventId, childId: testChildId },
    },
    result: { errors: [error] },
  }) as never;

const noFreePasswordsError = () =>
  new GraphQLError('No free passwords', {
    extensions: { code: 'NO_FREE_TICKET_SYSTEM_PASSWORDS_ERROR' },
  });

const setApiClientMocks = (mocks: MockedResponse[]) => {
  apiClient = new ApolloClient({
    link: new MockLink(mocks),
    cache: new InMemoryCache(),
  });
};

const waitForLoadingToFinish = () =>
  waitFor(() => {
    expect(screen.queryByLabelText('Lataa')).not.toBeInTheDocument();
  });

beforeEach(() => {
  vi.clearAllMocks();
  setApiClientMocks([assignMutationMock]);
});

describe('EventRedirect', () => {
  it('shows a loading spinner while the queries are in flight', () => {
    render(<EventRedirect />, defaultMocks());

    expect(screen.getByLabelText('Lataa')).toBeInTheDocument();
  });

  it('renders the event details and offers to acquire a password', async () => {
    render(<EventRedirect />, defaultMocks());
    await waitForLoadingToFinish();

    expect(
      screen.getByRole('heading', { name: 'Ilmoittaudu tapahtumaan' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Henkilökohtainen salasana' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Paikkojen määrä per salasana: 1 lapsi \+ 1 aikuinen\./)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Kyllä, lunastan salasanan!' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Takaisin' })).toHaveAttribute(
      'href',
      `/profile/child/${testChildId}/event/${testEventId}`
    );
  });

  it('assigns a password and shows it with a link to the ticket system', async () => {
    const user = userEvent.setup();
    render(<EventRedirect />, defaultMocks());
    await waitForLoadingToFinish();

    await user.click(
      screen.getByRole('button', { name: 'Kyllä, lunastan salasanan!' })
    );

    expect(await screen.findByText(ASSIGNED_PASSWORD)).toBeInTheDocument();
    expect(
      screen.getByText('Henkilökohtainen salasanasi:')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /Jatka ulkoiseen lipunmyyntipalveluun/i,
      })
    ).toHaveAttribute('href', TICKET_SYSTEM_URL);
  });

  it('shows a password that was already assigned, without offering to acquire one', async () => {
    render(<EventRedirect />, defaultMocks({ childPassword: 'EXISTING-999' }));
    await waitForLoadingToFinish();

    expect(await screen.findByText('EXISTING-999')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Kyllä, lunastan salasanan!' })
    ).not.toBeInTheDocument();
  });

  it('tells the user when no free passwords are left', async () => {
    render(<EventRedirect />, defaultMocks({ hasAnyFreePasswords: false }));
    await waitForLoadingToFinish();

    expect(
      await screen.findByText('Valitettavasti salasanoja ei ole enää jäljellä')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Kyllä, lunastan salasanan!' })
    ).not.toBeInTheDocument();
  });

  it('shows the cannot-enroll notice when the child cannot enroll', async () => {
    render(<EventRedirect />, defaultMocks({ canChildEnroll: false }));
    await waitForLoadingToFinish();

    expect(
      await screen.findByText(
        'Huomioithan, että et voi ilmoittautua tähän tapahtumaan.'
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Kyllä, lunastan salasanan!' })
    ).not.toBeInTheDocument();
  });

  it('shows a dedicated page and reports to Sentry when passwords have run out', async () => {
    const mocks = defaultMocks();
    mocks[0] = passwordQueryErrorMock(noFreePasswordsError());

    render(<EventRedirect />, mocks);

    expect(
      await screen.findByRole('heading', { name: 'Voi ei!' })
    ).toBeInTheDocument();
    expect(Sentry.captureException).toHaveBeenCalled();
  });

  it('shows the unexpected error page with the error message', async () => {
    const mocks = defaultMocks();
    mocks[0] = passwordQueryErrorMock(new GraphQLError('Something broke'));

    render(<EventRedirect />, mocks);

    expect(
      await screen.findByRole('heading', { name: 'Odottamaton virhe' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Something broke/)).toBeInTheDocument();
    expect(Sentry.captureException).toHaveBeenCalled();
  });
  it('logs and surfaces a failed password assignment', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    setApiClientMocks([
      {
        request: assignMutationMock.request,
        error: new Error('Assigning failed'),
      } as never,
    ]);
    const user = userEvent.setup();

    render(<EventRedirect />, defaultMocks());
    await waitForLoadingToFinish();

    await user.click(
      screen.getByRole('button', { name: 'Kyllä, lunastan salasanan!' })
    );

    expect(
      await screen.findByRole('heading', { name: 'Odottamaton virhe' })
    ).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('navigates back to the event from the no-free-passwords page', async () => {
    const user = userEvent.setup();
    const mocks = defaultMocks();
    mocks[0] = passwordQueryErrorMock(noFreePasswordsError());

    render(<EventRedirect />, mocks);

    await user.click(await screen.findByRole('button', { name: 'Takaisin' }));

    await waitFor(() => {
      expect(window.location.pathname).toBe(
        `/profile/child/${testChildId}/event/${testEventId}`
      );
    });
  });
});
