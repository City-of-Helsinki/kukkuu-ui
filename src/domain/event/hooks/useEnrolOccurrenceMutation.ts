import {
  type MutationFunctionOptions,
  useMutation,
} from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import type { GraphQLFormattedError } from 'graphql';

import useGetPathname from '../../../common/route/utils/useGetPathname';
import graphqlClient from '../../api/client';
import {
  EnrolmentDeniedReason,
  EnrolOccurrenceMutation,
  EnrolOccurrenceMutationVariables,
} from '../../api/generatedTypes/graphql';
import eventQuery from '../queries/eventQuery';
import enrolOccurrenceMutation from '../mutations/enrolOccurrenceMutation';
import getEventOrEventGroupOccurrenceRefetchQueries from '../getEventOrEventGroupOccurrenceRefetchQueries';
import { useProfileContext } from '../../profile/hooks/useProfileContext';
import { handleEnrolCompleted } from '../enrol/handleEnrolCompleted';
import { GQLErrors } from '../enrol/EnrolConstants';
import { getEnrolmentDeniedNotice } from '../EventUtils';
import getIsError from '../../api/utils/getIsError';

export type UseEnrolOccurrenceMutationOptions = {
  childId: string;
  eventId: string;
  eventGroupId?: string | null;
  registrationOpensAt?: string | null;
  onClose?: () => void;
  onSuccess?: (data?: EnrolOccurrenceMutation | null) => void;
};

export type EnrolOccurrenceMutationFn = (
  occurrenceIdOrOptions:
    | string
    | MutationFunctionOptions<
        EnrolOccurrenceMutation,
        EnrolOccurrenceMutationVariables
      >
) => Promise<unknown>;

function containsError(
  errors: ReadonlyArray<GraphQLFormattedError>,
  errorType: string
): boolean {
  return errors.some((error) => getIsError(error, errorType));
}

/**
 * Custom mutation hook for enrolling a child into an event occurrence.
 * Handles cache refetch queries, redirection, error toasts, and Sentry reporting.
 *
 * @param options - Configuration options including childId, eventId, eventGroupId, and callbacks.
 * @returns A tuple with the enrolOccurrence function and Apollo mutation result metadata.
 */
export function useEnrolOccurrenceMutation({
  childId,
  eventId,
  eventGroupId,
  registrationOpensAt,
  onClose,
  onSuccess,
}: UseEnrolOccurrenceMutationOptions) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getPathname = useGetPathname();
  const { refetchProfile } = useProfileContext();

  const [mutate, mutationResult] = useMutation<
    EnrolOccurrenceMutation,
    EnrolOccurrenceMutationVariables
  >(enrolOccurrenceMutation, {
    client: graphqlClient,
    refetchQueries: getEventOrEventGroupOccurrenceRefetchQueries({
      childId,
      eventGroupId: eventGroupId ?? undefined,
    }),
    awaitRefetchQueries: true,
    onCompleted: async (data) => {
      onClose?.();
      await handleEnrolCompleted(data, {
        childId,
        dispatch,
        refetchProfile,
        goToOccurrence: () => {
          navigate(
            getPathname(`/profile/child/${childId}/event/${eventId}`)
          );
        },
        t,
      });
      onSuccess?.(data);
    },
    onError: (error) => {
      if (
        containsError(
          error.graphQLErrors,
          GQLErrors.CHILD_ALREADY_JOINED_EVENT_ERROR
        )
      ) {
        onClose?.();
        navigate(
          getPathname(`/profile/child/${childId}/event/${eventId}`)
        );
        toast.warning(t('enrollment.enroll.error.childAlreadyJoined'));
      } else if (
        containsError(error.graphQLErrors, GQLErrors.OCCURRENCE_IS_FULL_ERROR)
      ) {
        mutationResult.client.refetchQueries({
          include: [
            {
              query: eventQuery,
              variables: {
                id: eventId,
                childId,
              },
            },
          ] as unknown as Parameters<
            typeof mutationResult.client.refetchQueries
          >[0]['include'],
        });
        onClose?.();
        toast.error(
          t(
            'enrollment.showEventInfo.occurrenceFull',
            'Tapahtuma-aika on täynnä.'
          )
        );
      } else if (
        containsError(
          error.graphQLErrors,
          GQLErrors.REGISTRATION_NOT_OPEN_ERROR
        )
      ) {
        onClose?.();
        toast.warning(
          getEnrolmentDeniedNotice({
            t,
            enrolmentDeniedReason: EnrolmentDeniedReason.RegistrationNotOpen,
            registrationOpensAt,
          })
        );
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
        toast.error(t('registration.submitMutation.errorMessage'));
        Sentry.captureException(error);
      }
    },
  });

  const enrolOccurrence: EnrolOccurrenceMutationFn = async (
    occurrenceIdOrOptions
  ) => {
    if (typeof occurrenceIdOrOptions === 'string') {
      return await mutate({
        variables: {
          input: {
            occurrenceId: occurrenceIdOrOptions,
            childId,
          },
        },
      });
    }
    return await mutate(occurrenceIdOrOptions);
  };

  return [enrolOccurrence, mutationResult] as const;
}

export default useEnrolOccurrenceMutation;
