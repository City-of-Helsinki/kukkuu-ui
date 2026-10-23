import { describe, expect, it, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';

import { store } from '../../../app/state/AppStore';
import { useEnrolOccurrenceMutation } from '../useEnrolOccurrenceMutation';
import enrolOccurrenceMutation from '../../mutations/enrolOccurrenceMutation';

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

  it('provides an enrolOccurrence function and executes mutation successfully', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();

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
});
