import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import joinClassNames from 'classnames';
import { GraphQLError } from 'graphql';

import PageWrapper from '../../app/layout/PageWrapper';
import styles from './enrol.module.scss';
import occurrenceQuery from '../queries/occurrenceQuery';
import {
  OccurrenceQuery,
  EnrolOccurrenceMutation,
  EnrolOccurrenceMutationVariables,
} from '../../api/generatedTypes/graphql';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import enrolOccurrenceMutation from '../mutations/enrolOccurrenceMutation';
import { saveChildEvents, justEnrolled } from '../state/EventActions';
import ErrorMessage from '../../../common/components/error/Error';
import getEventOrEventGroupOccurrenceRefetchQueries from '../getEventOrEventGroupOccurrenceRefetchQueries';
import { GQLErrors } from './EnrolConstants';
import Enrol from './Enrol';
import useGetPathname from '../../../common/route/utils/useGetPathname';

function containsAlreadyJoinedError(
  errors: ReadonlyArray<GraphQLError>
): boolean {
  return errors.some(
    (error: GraphQLError) =>
      error.extensions?.code === GQLErrors.CHILD_ALREADY_JOINED_EVENT_ERROR
  );
}

function containsOccurrenceFullError(
  errors: ReadonlyArray<GraphQLError>
): boolean {
  return errors.some(
    (error: GraphQLError) =>
      error.extensions?.code === GQLErrors.OCCURRENCE_IS_FULL_ERROR
  );
}

const EnrolPage = () => {
  const navigate = useNavigate();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const dispatch = useDispatch();
  const params = useParams<{
    childId: string;
    eventId: string;
    occurrenceId: string;
  }>();
  const {
    loading,
    error,
    data,
    refetch: refetchOccurrence,
  } = useQuery<OccurrenceQuery>(occurrenceQuery, {
    variables: {
      id: params.occurrenceId,
      childId: params.childId,
    },
  });
  const getPathname = useGetPathname();

  const goToOccurrence = () =>
    navigate(
      getPathname(
        `/profile/child/${params.childId}/occurrence/${data?.occurrence?.id}`
      ),
      { replace: true }
    );

  const childId = params.childId ?? '';

  // If redirect to /profile, need to do refetchquery
  // Might need to refetch myProfile in any case
  const [enrolOccurrence] = useMutation<
    EnrolOccurrenceMutation,
    EnrolOccurrenceMutationVariables
  >(enrolOccurrenceMutation, {
    refetchQueries: getEventOrEventGroupOccurrenceRefetchQueries({
      childId,
      eventGroupId: data?.occurrence?.event?.eventGroup?.id,
    }),
    onCompleted: (data) => {
      if (data?.enrolOccurrence?.enrolment?.child?.occurrences?.edges) {
        dispatch(
          saveChildEvents({
            childId,
            occurrences: data.enrolOccurrence.enrolment.child.occurrences,
          })
        );
        dispatch(justEnrolled());
      }

      goToOccurrence();
    },
    onError: (error) => {
      if (containsAlreadyJoinedError(error.graphQLErrors)) {
        goToOccurrence();
        toast.warning(t('enrollment.enroll.error.childAlreadyJoined'));
      } else if (containsOccurrenceFullError(error.graphQLErrors)) {
        // The occurrence has become full during the time between now
        // and the last time the data was refreshed. By re-fetching the
        // occurrence, we synchronize the data with the current truth,
        // which will in turn update the view to communicate that this
        // occurrence is full.
        refetchOccurrence();
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
        // Unknown errors are sent to Sentry
        Sentry.captureException(error);
      }
    },
  });

  if (loading || !childId) return <LoadingSpinner isLoading={true} />;
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    toast.error(t('api.errorMessage'));
    Sentry.captureException(error);
    return <ErrorMessage message={t('api.errorMessage')} />;
  }
  if (!data?.occurrence?.id) return <div>no data</div>;

  const enrol = async () => {
    if (!data?.occurrence?.id) {
      const noOccurrenceError = Error('No result');

      // eslint-disable-next-line no-console
      console.error(noOccurrenceError);
      toast.error(t('registration.submitMutation.errorMessage'));
      Sentry.captureException(noOccurrenceError);

      return;
    }

    await enrolOccurrence({
      variables: {
        input: {
          occurrenceId: data.occurrence.id,
          childId,
        },
      },
    });
  };

  const goToEvent = () => {
    navigate(
      getPathname(
        `/profile/child/${params.childId}/event/${params.eventId}`,
        language
      )
    );
  };

  const handleUnsubscribed = async () => {
    goToEvent();
  };

  return (
    <PageWrapper
      className={styles.wrapper}
      containerClassName={joinClassNames(styles.enrolContainer)}
    >
      <Enrol
        childId={childId}
        occurrence={data.occurrence}
        onCancel={() => goToEvent()}
        onEnrol={() => enrol()}
        onUnsubscribed={handleUnsubscribed}
        onSubscribed={() => goToEvent()}
      />
    </PageWrapper>
  );
};

export default EnrolPage;
