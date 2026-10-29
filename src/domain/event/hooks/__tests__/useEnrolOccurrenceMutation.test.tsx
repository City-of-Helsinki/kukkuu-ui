import { describe, expect, it, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { GraphQLError } from 'graphql';
import { toast } from 'react-toastify';

import { store } from '../../../app/state/AppStore';
import { useEnrolOccurrenceMutation } from '../useEnrolOccurrenceMutation';
import enrolOccurrenceMutation from '../../mutations/enrolOccurrenceMutation';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('../../../api/client', () => ({ default: undefined }));
vi.mock('../../getEventOrEventGroupOccurrenceRefetchQueries', () => ({
  default: () => [],
}));

const mockRefetchProfile = vi.fn().mockResolvedValue(undefined);
vi.mock('../../../profile/hooks/useProfileContext', () => ({
  useProfileContext: () => ({
    profile: { id: 'guardian-1' },
    refetchProfile: mockRefetchProfile,
    clearProfile: vi.fn(),
    updateProfile: vi.fn(),
    isLoading: false,
    isFetchCalled: true,
  }),
}));

describe('useEnrolOccurrenceMutation', () => {
  const childId = 'child-1';
  const eventId = 'event-1';
  const occurrenceId = 'occ-1';

  const mutationMock = {
    request: {
      query: enrolOccurrenceMutation,
      variables: {
        input: {
          occurrenceId,
          childId,
        },
      },
    },
    result: {
      data: {
        enrolOccurrence: {
          clientMutationId: null,
          enrolment: {
            id: 'enrolment-1',
            occurrence: {
              id: occurrenceId,
              event: { id: eventId },
              venue: { id: 'venue-1' },
            },
            child: {
              id: childId,
              occurrences: { edges: [] },
            },
          },
        },
      },
    },
  };

  it('provides an enrolOccurrence function and executes mutation successfully', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <BrowserRouter>
          <MockedProvider mocks={[mutationMock]} addTypename={false}>
            {children}
          </MockedProvider>
        </BrowserRouter>
      </Provider>
    );

    const { result } = renderHook(
      () =>
        useEnrolOccurrenceMutation({
          childId,
          eventId,
          onClose,
          onSuccess,
        }),
      { wrapper }
    );

    const [enrolOccurrence, mutationMeta] = result.current;
    expect(typeof enrolOccurrence).toBe('function');
    expect(mutationMeta.loading).toBe(false);

    await act(async () => {
      await enrolOccurrence(occurrenceId);
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('stays in modal on success and shows toast when stayInModalOnSuccess is true', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const toastSuccessSpy = vi.spyOn(toast, 'success');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <BrowserRouter>
          <MockedProvider mocks={[mutationMock]} addTypename={false}>
            {children}
          </MockedProvider>
        </BrowserRouter>
      </Provider>
    );

    const { result } = renderHook(
      () =>
        useEnrolOccurrenceMutation({
          childId,
          eventId,
          onClose,
          onSuccess,
          stayInModalOnSuccess: true,
        }),
      { wrapper }
    );

    const [enrolOccurrence] = result.current;

    await act(async () => {
      await enrolOccurrence(occurrenceId);
    });

    await waitFor(() => {
      expect(onClose).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
      expect(toastSuccessSpy).toHaveBeenCalled();
    });
  });

  it('handles REGISTRATION_NOT_OPEN_ERROR with future registrationOpensAt by closing and showing opening time toast', async () => {
    const onClose = vi.fn();

    const errorMock = {
      request: {
        query: enrolOccurrenceMutation,
        variables: {
          input: {
            occurrenceId,
            childId,
          },
        },
      },
      result: {
        errors: [
          new GraphQLError('Registration not open yet', {
            extensions: { code: 'REGISTRATION_NOT_OPEN_ERROR' },
          }),
        ],
      },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <BrowserRouter>
          <MockedProvider mocks={[errorMock]} addTypename={false}>
            {children}
          </MockedProvider>
        </BrowserRouter>
      </Provider>
    );

    const { result } = renderHook(
      () =>
        useEnrolOccurrenceMutation({
          childId,
          eventId,
          registrationOpensAt: '2099-06-01T07:00:00Z',
          onClose,
        }),
      { wrapper }
    );

    const [enrolOccurrence] = result.current;

    await act(async () => {
      try {
        await enrolOccurrence(occurrenceId);
      } catch {
        // Handled in onError
      }
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(toast.warning).toHaveBeenCalledWith(
        'Ilmoittautuminen alkaa 1.6.2099 klo 10:00'
      );
    });
  });

  it('handles REGISTRATION_NOT_OPEN_ERROR without registrationOpensAt by closing and showing generic toast', async () => {
    const onClose = vi.fn();

    const errorMock = {
      request: {
        query: enrolOccurrenceMutation,
        variables: {
          input: {
            occurrenceId,
            childId,
          },
        },
      },
      result: {
        errors: [
          new GraphQLError('Registration not open yet', {
            extensions: { code: 'REGISTRATION_NOT_OPEN_ERROR' },
          }),
        ],
      },
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <BrowserRouter>
          <MockedProvider mocks={[errorMock]} addTypename={false}>
            {children}
          </MockedProvider>
        </BrowserRouter>
      </Provider>
    );

    const { result } = renderHook(
      () =>
        useEnrolOccurrenceMutation({
          childId,
          eventId,
          registrationOpensAt: null,
          onClose,
        }),
      { wrapper }
    );

    const [enrolOccurrence] = result.current;

    await act(async () => {
      try {
        await enrolOccurrence(occurrenceId);
      } catch {
        // Handled in onError
      }
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(toast.warning).toHaveBeenCalledWith(
        'Ilmoittautuminen ei ole vielä alkanut'
      );
    });
  });
});
