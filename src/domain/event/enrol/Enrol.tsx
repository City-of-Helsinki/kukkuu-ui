import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import joinClassNames from 'classnames';
import { GraphQLError } from 'graphql';

import PageWrapper from '../../app/layout/PageWrapper';
import styles from './enrol.module.scss';
import occurrenceQuery from '../queries/occurrenceQuery';
import { occurrenceQuery as OccurrenceQueryType } from '../../api/generatedTypes/occurrenceQuery';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import OccurrenceInfo from '../partial/OccurrenceInfo';
import enrolOccurrenceMutation from '../mutations/enrolOccurrenceMutation';
import {
  enrolOccurrenceMutation as EnrolOccurrenceMutationData,
  enrolOccurrenceMutationVariables as EnrolOccurrenceMutationVariables,
} from '../../api/generatedTypes/enrolOccurrenceMutation';
import profileQuery from '../../profile/queries/ProfileQuery';
import { childByIdQuery } from '../../child/queries/ChildQueries';
import { saveChildEvents, justEnrolled } from '../state/EventActions';
import ErrorMessage from '../../../common/components/error/Error';
import Button from '../../../common/components/button/Button';
import { GQLErrors } from './EnrolConstants';

function check<D>(data: D, resultFactory: (data: D) => boolean): boolean {
  return resultFactory(data);
}

function containsAlreadyJoinedError(
  errors: ReadonlyArray<GraphQLError>
): boolean {
  return errors.some(
    (error: GraphQLError) =>
      error.extensions?.code === GQLErrors.CHILD_ALREADY_JOINED_EVENT_ERROR
  );
}

const Enrol = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const params = useParams<{
    childId: string;
    eventId: string;
    occurrenceId: string;
  }>();

  const { loading, error, data } = useQuery<OccurrenceQueryType>(
    occurrenceQuery,
    {
      variables: {
        id: params.occurrenceId,
      },
    }
  );

  // If redirect to /profile, need to do refetchquery
  // Might need to refetch myProfile in any case
  const [enrolOccurrence] = useMutation<
    EnrolOccurrenceMutationData,
    EnrolOccurrenceMutationVariables
  >(enrolOccurrenceMutation, {
    refetchQueries: [
      { query: profileQuery },
      {
        query: childByIdQuery,
        variables: {
          id: params.childId,
        },
      },
    ],
    onCompleted: (data) => {
      if (data?.enrolOccurrence?.enrolment?.child.occurrences.edges) {
        dispatch(
          saveChildEvents({
            childId: params.childId,
            occurrences: data.enrolOccurrence.enrolment.child.occurrences,
          })
        );
        dispatch(justEnrolled());
      }
    },
    onError: (error) => {
      if (check(error.graphQLErrors, containsAlreadyJoinedError)) {
        toast.warning(t('enrollment.enroll.error.childAlreadyJoined'));
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
        // Unknown errors are sent to Sentry
        Sentry.captureException(error);
      }
    },
  });

  if (loading) return <LoadingSpinner isLoading={true} />;
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
          childId: params.childId,
        },
      },
    });

    history.replace(
      `/profile/child/${params.childId}/occurrence/${data.occurrence.id}`
    );
  };

  return (
    <PageWrapper
      className={styles.wrapper}
      containerClassName={joinClassNames(styles.enrolContainer)}
      title={'Enrol'}
    >
      <div className={styles.enrolWrapper} role="main">
        <div className={styles.heading}>
          <h1>{`${t('enrollment.confirmationPage.heading')} ${
            data.occurrence.event.name
          }`}</h1>
        </div>
        <div className={styles.text}>
          {t('enrollment.confirmationPage.text')}
        </div>
        <OccurrenceInfo
          occurrence={data.occurrence}
          className={joinClassNames(styles.occurrenceInfo, styles.wrap)}
        />

        <div className={styles.actions}>
          <Button onClick={() => enrol()}>
            {t('enrollment.confirmationPage.confirm.button')}
          </Button>

          <Button onClick={() => history.goBack()} variant="secondary">
            {t('enrollment.confirmationPage.cancel.button')}
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Enrol;
