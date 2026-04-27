import { vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

import { customRender as render } from '../../../common/test/customRender';
import ExternalTicketSystemEventIsEnrolled from '../ExternalTicketSystemEventIsEnrolled';
import { externalTicketSystemEventQuery } from '../queries/externalTicketSystemEventQuery';
import {
  testEventId,
  testChildId,
  externalTicketSystemEnrolledMock,
} from '../__mocks__/eventMocks';

vi.mock('@sentry/browser');

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ childId: testChildId, eventId: testEventId }),
  };
});

vi.mock('../../profile/children/child/useChildRouteGoBackTo', () => ({
  default: () => '/profile/child/child-123',
  useChildRouteGoBackTo: () => '/profile/child/child-123',
}));

const waitForLoadingToFinish = () =>
  waitFor(() => {
    expect(screen.queryByLabelText('Lataa')).not.toBeInTheDocument();
  });

describe('ExternalTicketSystemEventIsEnrolled', () => {
  it('renders event content', async () => {
    render(<ExternalTicketSystemEventIsEnrolled />, [
      externalTicketSystemEnrolledMock,
    ]);

    await waitForLoadingToFinish();

    expect(
      screen.getByText('An external ticket event description')
    ).toBeInTheDocument();
    expect(screen.getByText('SECRET123')).toBeInTheDocument();

    const continueLink = screen.getByRole('link', {
      name: /Jatka ulkoiseen lipunmyyntipalveluun/i,
    });
    expect(continueLink).toBeInTheDocument();
    expect(continueLink).toHaveAttribute(
      'href',
      'https://ticketmaster.fi/event/123'
    );

    expect(
      screen.getByText('Henkilökohtainen salasanasi:')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Paikkojen määrä per salasana/i)
    ).toBeInTheDocument();
  });

  it('shows error message when query fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const errorMock = {
      request: {
        query: externalTicketSystemEventQuery,
        variables: { eventId: testEventId, childId: testChildId },
      },
      error: new Error('Query failed'),
    };

    render(<ExternalTicketSystemEventIsEnrolled />, [errorMock]);

    expect(
      await screen.findByText(/Tapahtui virhe/i)
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('shows error message when event data is null', async () => {
    const nullEventMock = {
      request: {
        query: externalTicketSystemEventQuery,
        variables: { eventId: testEventId, childId: testChildId },
      },
      result: { data: { event: null } },
    };

    render(<ExternalTicketSystemEventIsEnrolled />, [nullEventMock]);

    expect(
      await screen.findByText(/Tapahtui virhe/i)
    ).toBeInTheDocument();
  });
});
