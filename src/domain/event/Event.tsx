import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import * as Sentry from '@sentry/browser';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { EventQuery } from '../api/generatedTypes/graphql';
import PageWrapper from '../app/layout/PageWrapper';
import eventQuery from './queries/eventQuery';
import EventDetailsPage from './eventDetails/EventDetailsPage';
import RelayList from '../api/relayList';
import type { OccurrenceNode } from './types/EventQueryTypes';
import { extractUniqueVenues } from './EventUtils';
import styles from './event.module.scss';
import { useEventRouteGoBackTo } from './route/EventRoute';

const OccurrenceList = RelayList<OccurrenceNode>();

const Event = () => {
  const { t } = useTranslation();
  const goBackTo = useEventRouteGoBackTo();
  const { childId, eventId } = useParams<{
    childId: string;
    eventId: string;
  }>();

  const variables = {
    id: eventId,
    childId: childId,
  };

  const { loading, error, data } = useQuery<EventQuery>(eventQuery, {
    skip: !eventId || !childId,
    variables,
  });

  if (loading) return <LoadingSpinner isLoading={true} />;

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    Sentry.captureException(error);
    return (
      <PageWrapper>
        <div className={styles.event}>{t('api.errorMessage')}</div>
      </PageWrapper>
    );
  }

  if (!data?.event) {
    return <div>No event</div>;
  }

  const event = data.event;
  const allOccurrences = OccurrenceList(data.event.allOccurrences).items;
  const venues = extractUniqueVenues(null, allOccurrences);

  return (
    <EventDetailsPage
      event={event}
      allOccurrences={allOccurrences}
      venues={venues}
      childId={childId || ''}
      backTo={goBackTo}
    />
  );
};

export default Event;
