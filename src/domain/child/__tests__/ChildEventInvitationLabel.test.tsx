import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import * as React from 'react';

import ChildEventInvitationLabel from '../ChildEventInvitationLabel';
import { childEventInvitationLabelQuery } from '../queries/ChildEventInvitationLabelQuery';
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

describe('ChildEventInvitationLabel', () => {
  const childId = 'test-child-id';

  type MockProps = {
    canChildEnroll: boolean;
    areAllCurrentEnrolmentsUsed: boolean;
  };

  const createMock = ({
    canChildEnroll,
    areAllCurrentEnrolmentsUsed,
  }: MockProps) => {
    return [
      {
        request: {
          query: childEventInvitationLabelQuery,
          variables: { childId },
        },
        result: {
          data: {
            child: {
              id: childId,
              upcomingEventsAndEventGroups: {
                edges: [
                  {
                    node: {
                      canChildEnroll,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        request: {
          query: childEnrolmentCountQuery,
          variables: { childId },
        },
        result: {
          data: {
            child: {
              id: childId,
              enrolmentCount: areAllCurrentEnrolmentsUsed ? 10 : 5,
              pastEnrolmentCount: 0,
              project: {
                id: 'test-project-id',
                enrolmentLimit: 10,
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

  it('should not render the invitation label if no upcoming events where child can enrol', async () => {
    const mocks = createMock({
      canChildEnroll: false,
      areAllCurrentEnrolmentsUsed: false,
    });
    render(<ChildEventInvitationLabel childId={childId} />, {
      wrapper: getMockedProviders(mocks),
    });

    await waitFor(() =>
      expect(
        screen.queryByText('profile.child.invitationLabel.text')
      ).not.toBeInTheDocument()
    );
  });

  it('should not render the invitation label if all current enrolments are used', async () => {
    const mocks = createMock({
      canChildEnroll: true,
      areAllCurrentEnrolmentsUsed: true,
    });
    render(<ChildEventInvitationLabel childId={childId} />, {
      wrapper: getMockedProviders(mocks),
    });

    await waitFor(() =>
      expect(
        screen.queryByText('profile.child.invitationLabel.text')
      ).not.toBeInTheDocument()
    );
  });

  // eslint-disable-next-line max-len
  it('should render the invitation label if there are upcoming events and not all current enrolments are used', async () => {
    const mocks = createMock({
      canChildEnroll: true,
      areAllCurrentEnrolmentsUsed: false,
    });
    render(<ChildEventInvitationLabel childId={childId} />, {
      wrapper: getMockedProviders(mocks),
    });

    await waitFor(() => {
      expect(
        screen.getByText('profile.child.invitationLabel.text')
      ).toBeInTheDocument();
    });
  });
});
