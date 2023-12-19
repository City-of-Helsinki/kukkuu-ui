import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { useQuery } from '@apollo/client';

import styles from './event.module.scss';
import occurrenceQuery from './queries/occurrenceQuery';
import { OccurrenceQuery } from '../api/generatedTypes/graphql';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import OccurrenceInfo from './partial/OccurrenceInfo';
import UnenrolModal from './modal/UnenrolModal';
import VenueFeatures from './VenueFeatures';
import Paragraph from '../../common/components/paragraph/Paragraph';
import EventPage from './EventPage';
import SuccessToast from './enrol/SuccessToast';
import ErrorMessage from '../../common/components/error/Error';
import Button from '../../common/components/button/Button';
import { useChildRouteGoBackTo } from '../profile/children/child/ProfileChildDetail';

const EventIsEnrolled = () => {
  const { t } = useTranslation();
  const goBackTo = useChildRouteGoBackTo();
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams<{ childId: string; occurrenceId: string }>();
  const { loading, error, data } = useQuery<OccurrenceQuery>(occurrenceQuery, {
    variables: {
      id: params.occurrenceId,
      childId: params.childId,
    },
  });

  const errorMessage = <ErrorMessage message={t('api.errorMessage')} />;

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) {
    Sentry.captureException(error);
    return errorMessage;
  }

  if (!data?.occurrence) return errorMessage;

  return (
    <EventPage
      event={data.occurrence.event}
      success={<SuccessToast />}
      backTo={goBackTo}
    >
      <OccurrenceInfo
        className={styles.occurrenceInfo}
        occurrence={data.occurrence}
      />
      <div className={styles.description}>
        <Paragraph text={data.occurrence.event.description || ''} />
      </div>
      <div className={styles.participantsPerInvite}>
        {t(
          `event.participantsPerInviteEnumLong.${data.occurrence.event.participantsPerInvite}`
        )}
      </div>
      <h2>{t('event.cancellation.heading')}</h2>
      <div className={styles.cancelButtonWrapper}>
        <Button variant="secondary" onClick={() => setIsOpen(true)}>
          {t('event.cancellation.buttonText')}
        </Button>
      </div>
      <VenueFeatures venue={data.occurrence.venue} />
      {isOpen && (
        <UnenrolModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          childId={params.childId ?? ''}
          occurrenceId={data.occurrence.id}
          eventGroupId={data?.occurrence?.event?.eventGroup?.id}
        />
      )}
    </EventPage>
  );
};

export default EventIsEnrolled;
