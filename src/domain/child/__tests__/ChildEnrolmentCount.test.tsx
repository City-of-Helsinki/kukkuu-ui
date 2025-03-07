import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

import ChildEnrolmentCount from '../ChildEnrolmentCount';
import { childEnrolmentCountQuery } from '../queries/ChildEnrolmentCountQuery';

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

describe('ChildEnrolmentCount', () => {
  const childId = 'test-child-id';
  const loadingText = 'Page is loading';

  type MockProps = {
    enrolmentCount: number | null;
    areAllCurrentEnrolmentsUsed: boolean;
    delayMs?: number;
  };

  const createMock = ({
    enrolmentCount,
    areAllCurrentEnrolmentsUsed,
    delayMs,
  }: MockProps) => {
    return [
      {
        request: {
          query: childEnrolmentCountQuery,
          variables: { childId: childId },
        },
        delay: delayMs,
        result: {
          data: {
            child: {
              id: childId,
              enrolmentCount: enrolmentCount,
              project: {
                id: 'projectId',
                enrolmentLimit: areAllCurrentEnrolmentsUsed
                  ? enrolmentCount
                  : (enrolmentCount ?? 0) + 1,
              },
            },
          },
        },
      },
    ];
  };

  const getMockedProviders =
    (mocks?: readonly MockedResponse<any, any>[]) =>
    // eslint-disable-next-line react/display-name
    ({ children }: { children: React.ReactNode }) => {
      return (
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        </MockedProvider>
      );
    };

  it('renders loading spinner when data is not available', async () => {
    const mocks = createMock({
      enrolmentCount: null,
      areAllCurrentEnrolmentsUsed: false,
      delayMs: 5_000, // add delay to ensure the query is loading
    });

    render(<ChildEnrolmentCount childId={childId} />, {
      wrapper: getMockedProviders(mocks),
    });

    expect(screen.getByText(loadingText)).toBeInTheDocument();
  });

  it('renders enrolment count when data is available', async () => {
    const mocks = createMock({
      enrolmentCount: 5,
      areAllCurrentEnrolmentsUsed: false,
    });

    render(<ChildEnrolmentCount childId={childId} />, {
      wrapper: getMockedProviders(mocks),
    });

    await waitFor(() =>
      expect(screen.queryByText(loadingText)).not.toBeInTheDocument()
    );

    expect(
      screen.getByText('child.message.eventVisitsThisYear: 5')
    ).toBeInTheDocument();
  });

  it('renders success pill when all current enrolments are used', async () => {
    const mocks = createMock({
      enrolmentCount: 5,
      areAllCurrentEnrolmentsUsed: true,
    });

    render(<ChildEnrolmentCount childId={childId} />, {
      wrapper: getMockedProviders(mocks),
    });

    await screen.findByText('child.message.eventVisitsThisYear: 5');
    const pill = screen.getByTestId('kukkuu-pill-success');
    expect(pill).toBeInTheDocument();
  });

  it('renders default pill when all current enrolments are not used', async () => {
    const mocks = createMock({
      enrolmentCount: 5,
      areAllCurrentEnrolmentsUsed: false,
    });

    render(<ChildEnrolmentCount childId={childId} />, {
      wrapper: getMockedProviders(mocks),
    });

    await screen.findByText('child.message.eventVisitsThisYear: 5');
    const pill = screen.getByTestId('kukkuu-pill-default');
    expect(pill).toBeInTheDocument();
  });
});
