import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import * as Sentry from '@sentry/browser';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import joinClassNames from 'classnames';

import PageWrapper from '../../app/layout/PageWrapper';
import styles from './enrol.module.scss';
import Button from '../../../common/components/button/Button';
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

const Enrol: FunctionComponent = () => {
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
      if (data?.enrolOccurrence?.enrolment?.child.enrolments.edges) {
        dispatch(
          saveChildEvents({
            childId: params.childId,
            enrolments: data.enrolOccurrence.enrolment.child.enrolments,
          })
        );
        dispatch(justEnrolled());
      }
    },
  });

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) {
    console.error(error);
    toast(t('api.errorMessage'), {
      type: toast.TYPE.ERROR,
    });
    Sentry.captureException(error);
    return (
      <PageWrapper>
        <div className={styles.event}>{t('api.errorMessage')}</div>
      </PageWrapper>
    );
  }
  if (!data?.occurrence?.id) return <div>no data</div>;
  const enrol = async () => {
    try {
      if (!data?.occurrence?.id) throw Error('No result');
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
    } catch (error) {
      // TODO: KK-280 Handle errors nicely
      console.error(error);
      toast(t('registration.submitMutation.errorMessage'), {
        type: toast.TYPE.ERROR,
      });
    }
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
          <Button className={styles.submitButton} onClick={() => enrol()}>
            {t('enrollment.confirmationPage.confirm.button')}
          </Button>

          <Button
            className={styles.backButton}
            onClick={() => history.goBack()}
          >
            {t('enrollment.confirmationPage.cancel.button')}
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Enrol;
