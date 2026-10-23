import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { GraphQLError } from 'graphql';

import { customRender as render } from '../../../../common/test/customRender';
import EnrolOccurrenceModal, {
  EnrolOccurrenceModalProps,
} from '../EnrolOccurrenceModal';
import eventQuery from '../../queries/eventQuery';
import enrolOccurrenceMutation from '../../mutations/enrolOccurrenceMutation';
import { EventParticipantsPerInvite } from '../../../api/generatedTypes/graphql';
import { GQLErrors } from '../../enrol/EnrolConstants';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../api/client', () => ({ default: undefined }));
vi.mock('../../../api/client', () => ({ default: undefined }));

vi.mock('../../getEventOrEventGroupOccurrenceRefetchQueries', () => ({
  default: () => [],
}));

const mockProfile = {
  firstName: 'Matti',
  lastName: 'Meikäläinen',
  children: {
    edges: [
      {
        node: {
          id: 'child-123',
          name: 'Pikku Myy',
        },
      },
    ],
  },
};

const mockRefetchProfile = vi.fn().mockResolvedValue(undefined);

vi.mock('../../../profile/hooks/useProfileContext', () => ({
  useProfileContext: () => ({
    profile: mockProfile,
    refetchProfile: mockRefetchProfile,
    clearProfile: vi.fn(),
    updateProfile: vi.fn(),
    isLoading: false,
    isFetchCalled: true,
  }),
}));

const defaultProps: EnrolOccurrenceModalProps = {
  isOpen: true,
  onClose: vi.fn(),
  childId: 'child-123',
  event: {
    id: 'event-1',
    name: 'Musiikkisatu',
    shortDescription: 'Hauska satuhetki',
    duration: 45,
    participantsPerInvite: EventParticipantsPerInvite.ChildAndGuardian,
    eventGroup: null,
  },
  occurrence: {
    id: 'occ-1',
    time: '2026-10-04T10:00:00Z',
    remainingCapacity: 8,
    occurrenceLanguage: 'FI',
    venue: {
      name: 'Annantalo',
      address: 'Annankatu 30',
    },
  },
};

describe('EnrolOccurrenceModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal details, participants, notices, and buttons when open', () => {
    render(<EnrolOccurrenceModal {...defaultProps} />, []);

    expect(
      screen.getByRole('dialog', { name: 'Vahvista ilmoittautuminen' })
    ).toBeInTheDocument();
    expect(screen.getByText('Musiikkisatu')).toBeInTheDocument();
    expect(screen.getByText('Annantalo, Annankatu 30')).toBeInTheDocument();
    expect(screen.getByText('Su 4.10.2026 klo 13:00–13:45')).toBeInTheDocument();
    expect(screen.getByText('Vapaata tilaa: 8 paikkaa')).toBeInTheDocument();
    expect(
      screen.getByText('1 lapsi + 1 aikuinen')
    ).toBeInTheDocument();

    expect(screen.getByText('Osallistujat')).toBeInTheDocument();
    expect(screen.getByLabelText('Pikku Myy')).toBeChecked();
    expect(screen.getByLabelText('Matti Meikäläinen (sinä)')).toBeChecked();

    expect(
      screen.getByText(/Kulttuurilapsi voi osallistua yhteen tapahtumaan kaudessa/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ilmoittautuminen on sitova/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Vahvista ilmoittautuminen' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Peruuta' })
    ).toBeInTheDocument();
  });

  it('does not render dialog when isOpen is false', () => {
    render(<EnrolOccurrenceModal {...defaultProps} isOpen={false} />, []);

    expect(
      screen.queryByRole('dialog', { name: 'Vahvista ilmoittautuminen' })
    ).not.toBeInTheDocument();
  });

  it('calls onClose when clicking cancel button or close button', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<EnrolOccurrenceModal {...defaultProps} onClose={onClose} />, []);

    const cancelButton = screen.getByRole('button', { name: 'Peruuta' });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('executes enrolOccurrenceMutation when confirming, calls onClose, and navigates', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    const mutationResult = vi.fn(() => ({
      data: {
        enrolOccurrence: {
          clientMutationId: null,
          enrolment: {
            id: 'enrolment-1',
            occurrence: {
              id: 'occ-1',
              event: { id: 'event-1' },
              venue: { id: 'venue-1' },
            },
            child: {
              id: 'child-123',
              occurrences: {
                edges: [],
              },
              pastEvents: {
                edges: [],
              },
              availableEvents: {
                edges: [],
              },
            },
          },
        },
      },
    }));

    render(<EnrolOccurrenceModal {...defaultProps} onClose={onClose} />, [
      {
        request: {
          query: enrolOccurrenceMutation,
          variables: {
            input: {
              occurrenceId: 'occ-1',
              childId: 'child-123',
            },
          },
        },
        result: mutationResult,
      },
    ]);

    const confirmButton = screen.getByRole('button', {
      name: 'Vahvista ilmoittautuminen',
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mutationResult).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(
        '/profile/child/child-123/event/event-1'
      );
    });
  });

  it('handles child already joined error by closing modal and navigating with warning', async () => {
    const onClose = vi.fn();
    const toastWarningSpy = vi.spyOn(toast, 'warning');
    const user = userEvent.setup();

    const alreadyJoinedError = new GraphQLError(
      'Already joined',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { code: GQLErrors.CHILD_ALREADY_JOINED_EVENT_ERROR }
    );

    render(<EnrolOccurrenceModal {...defaultProps} onClose={onClose} />, [
      {
        request: {
          query: enrolOccurrenceMutation,
          variables: {
            input: {
              occurrenceId: 'occ-1',
              childId: 'child-123',
            },
          },
        },
        result: {
          errors: [alreadyJoinedError],
        },
      },
    ]);

    const confirmButton = screen.getByRole('button', {
      name: 'Vahvista ilmoittautuminen',
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(
        '/profile/child/child-123/event/event-1'
      );
      expect(toastWarningSpy).toHaveBeenCalled();
    });
  });

  it('handles occurrence full error by showing error toast', async () => {
    const onClose = vi.fn();
    const toastErrorSpy = vi.spyOn(toast, 'error');
    const user = userEvent.setup();

    const occurrenceFullError = new GraphQLError(
      'Occurrence full',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { code: GQLErrors.OCCURRENCE_IS_FULL_ERROR }
    );

    render(<EnrolOccurrenceModal {...defaultProps} onClose={onClose} />, [
      {
        request: {
          query: enrolOccurrenceMutation,
          variables: {
            input: {
              occurrenceId: 'occ-1',
              childId: 'child-123',
            },
          },
        },
        result: {
          errors: [occurrenceFullError],
        },
      },
      {
        request: {
          query: eventQuery,
          variables: {
            id: 'event-1',
            childId: 'child-123',
          },
        },
        result: {
          data: {
            event: null,
          },
        },
      },
    ]);

    const confirmButton = screen.getByRole('button', {
      name: 'Vahvista ilmoittautuminen',
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(toastErrorSpy).toHaveBeenCalled();
    });
  });
});
