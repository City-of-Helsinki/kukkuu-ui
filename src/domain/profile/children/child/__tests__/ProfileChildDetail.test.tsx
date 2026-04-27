// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Sentry from '@sentry/browser';

import { customRender as render } from '../../../../../common/test/customRender';
import ProfileChildDetail from '../ProfileChildDetail';
import { childByIdQuery } from '../../../../child/queries/ChildQueries';
import * as ProfileContextModule from '../../../hooks/useProfileContext';
import {
  testChildId,
  childByIdMock,
  enrolmentCountMock,
  childNotesMock,
} from '../../../../child/__mocks__/childMocks';

vi.mock('@sentry/browser');

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ childId: 'child-123' }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../useProfileRouteGoBackTo', () => ({
  default: () => '/profile',
}));

vi.mock('../modal/ProfileChildDetailEditModal', () => ({
  default: ({ setIsOpen }: { setIsOpen: (v: boolean) => void }) => (
    <div data-testid="edit-modal">
      <button onClick={() => setIsOpen(false)}>Close modal</button>
    </div>
  ),
}));

vi.mock('../../../../child/ChildEnrolmentCount', () => ({
  default: () => <div data-testid="child-enrolment-count" />,
}));

vi.mock('../../../events/AdditionalNotesCard', () => ({
  default: ({ title }: { title?: string }) => (
    <div data-testid="additional-notes-card">{title}</div>
  ),
}));

const happyPathMocks = [childByIdMock, enrolmentCountMock, childNotesMock];

const mockProfileContextValue = {
  profile: { id: 'profile-1', firstName: 'Test', lastName: 'User' },
  refetchProfile: vi.fn(),
  clearProfile: vi.fn(),
  updateProfile: vi.fn(),
  isLoading: false,
  isFetchCalled: true,
};

describe('ProfileChildDetail', () => {
  beforeEach(() => {
    vi.spyOn(ProfileContextModule, 'useProfileContext').mockReturnValue(
      mockProfileContextValue
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (mocks = happyPathMocks) =>
    render(<ProfileChildDetail />, mocks);

  const waitForLoadingToFinish = () =>
    waitFor(() => {
      expect(screen.queryByLabelText('Lataa')).not.toBeInTheDocument();
    });

  it('shows loading spinner while loading', () => {
    renderComponent();

    expect(screen.getByLabelText('Lataa')).toBeInTheDocument();
  });

  it('renders child name when data loads', async () => {
    renderComponent();

    await waitForLoadingToFinish();

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders the edit button', async () => {
    renderComponent();

    await waitForLoadingToFinish();

    expect(
      screen.getByRole('button', { name: /Muokkaa lapsen tietoja/i })
    ).toBeInTheDocument();
  });

  it('shows "no child" text when child data is null', async () => {
    const noChildMock = {
      request: {
        query: childByIdQuery,
        variables: { id: testChildId },
      },
      result: { data: { child: null } },
    };

    renderComponent([noChildMock]);

    expect(await screen.findByText('Ei kummilapsia')).toBeInTheDocument();
  });

  it('shows error message and captures to Sentry when query fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const errorMock = {
      request: {
        query: childByIdQuery,
        variables: { id: testChildId },
      },
      error: new Error('Query failed'),
    };

    renderComponent([errorMock]);

    expect(await screen.findByText(/Tapahtui virhe/i)).toBeInTheDocument();
    expect(Sentry.captureException).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('opens the edit modal when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitForLoadingToFinish();

    await user.click(
      screen.getByRole('button', { name: /Muokkaa lapsen tietoja/i })
    );

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
  });

  it('renders the notes section heading', async () => {
    renderComponent();

    await waitForLoadingToFinish();

    expect(
      screen.getByText(/Päiväkirjamerkintäni tapahtumista/i)
    ).toBeInTheDocument();
  });
});
