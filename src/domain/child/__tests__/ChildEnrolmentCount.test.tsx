import { render, screen } from '@testing-library/react';
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

  const createMock = (
    enrolmentCount: number | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    areAllCurrentEnrolmentsUsed: boolean
  ) => {
    return [
      {
        request: {
          query: childEnrolmentCountQuery,
          variables: { childId: childId },
        },
        result: {
          data: {
            child: {
              id: childId,
              enrolmentCount: enrolmentCount,
              project: {
                id: 'projectId',
                enrolmentLimit: areAllCurrentEnrolmentsUsed
                  ? enrolmentCount
                  : (enrolmentCount || 0) + 1,
              },
            },
          },
        },
      },
      {
        request: {
          query: childEnrolmentCountQuery,
          variables: { childId: childId },
        },
        newData: () => {
          return {
            data: {
              child: {
                id: childId,
                enrolmentCount: enrolmentCount,
                project: {
                  id: 'projectId',
                  enrolmentLimit: areAllCurrentEnrolmentsUsed
                    ? enrolmentCount
                    : (enrolmentCount || 0) + 1,
                },
              },
            },
          };
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
    const mocks = createMock(null, false);

    render(<ChildEnrolmentCount childId={childId} />, {
      wrapper: getMockedProviders(mocks),
    });

    expect(screen.getByText('Page is loading')).toBeInTheDocument();
    await screen.findByText('child.message.eventVisitsThisYear:');
    expect(
      screen.getByText('child.message.eventVisitsThisYear:')
    ).toBeInTheDocument();
  });

  it('renders enrolment count when data is available', async () => {
    const mocks = createMock(5, false);

    render(<ChildEnrolmentCount childId={childId} />, {
      wrapper: getMockedProviders(mocks),
    });

    await screen.findByText('child.message.eventVisitsThisYear: 5');
    expect(
      screen.getByText('child.message.eventVisitsThisYear: 5')
    ).toBeInTheDocument();
  });

  it('renders success pill when all current enrolments are used', async () => {
    const mocks = createMock(5, true);

    render(<ChildEnrolmentCount childId={childId} />, {
      wrapper: getMockedProviders(mocks),
    });

    await screen.findByText('child.message.eventVisitsThisYear: 5');
    const pill = screen.getByTestId('kukkuu-pill-success');
    expect(pill).toBeInTheDocument();
  });

  it('renders default pill when all current enrolments are not used', async () => {
    const mocks = createMock(5, false);

    render(<ChildEnrolmentCount childId={childId} />, {
      wrapper: getMockedProviders(mocks),
    });

    await screen.findByText('child.message.eventVisitsThisYear: 5');
    const pill = screen.getByTestId('kukkuu-pill-default');
    expect(pill).toBeInTheDocument();
  });
});
