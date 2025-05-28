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
import ErrorMessage from '../../common/components/error/Error';
import Button from '../../common/components/button/Button';
import useChildRouteGoBackTo from '../profile/children/child/useChildRouteGoBackTo';
import { shouldAllowUnenrolment } from './EventUtils';
import AppConfig from '../app/AppConfig';

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

  const disableUnenrolling = !shouldAllowUnenrolment(data.occurrence.time);
  const unerolHoursBeforeOccurrence =
    AppConfig.enrolmentCancellationTimeLimitHours;

  return (
    <EventPage event={data.occurrence.event} backTo={goBackTo}>
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
      <p id="eventCancellationDescription">
        {disableUnenrolling
          ? t('enrollment.cancellation.disabledDescription', {
              unerolHoursBeforeOccurrence,
            })
          : t('enrollment.cancellation.enabledDescription', {
              unerolHoursBeforeOccurrence,
            })}
      </p>
      <div className={styles.cancelButtonWrapper}>
        <Button
          id="unenrolButton"
          variant="secondary"
          aria-describedby="eventCancellationDescription"
          onClick={() => setIsOpen(true)}
          disabled={disableUnenrolling}
        >
          {t('event.cancellation.buttonText')}
        </Button>
      </div>
      <VenueFeatures venue={data.occurrence.venue} />
      {isOpen && !disableUnenrolling && (
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
