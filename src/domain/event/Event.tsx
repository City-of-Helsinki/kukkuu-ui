import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router';
import { useQuery } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import { Notification } from 'hds-react';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import Paragraph from '../../common/components/paragraph/Paragraph';
import {
  EnrolmentDeniedReason,
  EventQuery,
  TicketSystem,
  EventExternalTicketSystemHasAnyFreePasswordsQuery,
} from '../api/generatedTypes/graphql';
import PageWrapper from '../app/layout/PageWrapper';
import eventQuery, {
  eventExternalTicketSystemHasAnyFreePasswordsQuery,
} from './queries/eventQuery';
import EventEnrol from './EventEnrol';
import EventPage from './EventPage';
import EventParticipantsPerInvite from './EventParticipantsPerInvite';
import styles from './event.module.scss';
import eventRedirectStyles from './eventRedirect.module.scss';
import { useEventRouteGoBackTo } from './route/EventRoute';
import LinkButton from '../../common/components/button/LinkButton';
import useGetPathname from '../../common/route/utils/useGetPathname';
import Text from '../../common/components/text/Text';
import { externalTicketSystems } from './constants/ExternalTicketSystemConstants';
import type { FilterValues } from './types';
import {
  getDateOptions,
  getEnrolmentDeniedNotice,
  getTimeOptions,
} from './EventUtils';

const initialFilterValues = {
  date: '',
  time: '',
};

type ExternalTicketSystemEventEnrolProps = {
  enrolmentDeniedReason?: EnrolmentDeniedReason | null;
  registrationOpensAt?: string | null;
  hasFreePasswords: boolean;
  continueUrl: string;
};

/**
 * External ticket system enrolment actions of an event: the back button
 * always, and either a notification above it explaining why the child
 * cannot enrol, or, when the child can, a continue link button or a text
 * saying there are no free passwords left.
 */
const ExternalTicketSystemEventEnrol: React.FC<
  ExternalTicketSystemEventEnrolProps
> = ({
  enrolmentDeniedReason,
  registrationOpensAt,
  hasFreePasswords,
  continueUrl,
}) => {
  const { t } = useTranslation();
  const goBackTo = useEventRouteGoBackTo();
  const canChildEnroll = enrolmentDeniedReason === null;

  return (
    <>
      <hr className={styles.divider} />
      {!canChildEnroll && (
        <div className={styles.externalTicketSystemNotification}>
          <Notification type="alert">
            {getEnrolmentDeniedNotice({
              t,
              enrolmentDeniedReason,
              registrationOpensAt,
            })}
          </Notification>
        </div>
      )}
      <div className={styles.externalTicketSystemButtons}>
        <LinkButton variant="secondary" to={goBackTo}>
          {t('event.externalTicketSystemButtons.back')}
        </LinkButton>
        {canChildEnroll && hasFreePasswords && (
          <LinkButton variant="primary" to={continueUrl}>
            {t('event.externalTicketSystemButtons.continue')}
          </LinkButton>
        )}
        {canChildEnroll && !hasFreePasswords && (
          <Text
            variant="body-l"
            className={eventRedirectStyles.noFreeTicketSystemPasswordsLeftLabel}
          >
            {t('eventRedirectPage.noFreeTicketSystemPasswordsLeftLabel')}
          </Text>
        )}
      </div>
    </>
  );
};

const Event = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const goBackTo = useEventRouteGoBackTo();
  const { childId, eventId } = useParams<{
    childId: string;
    eventId: string;
  }>();
  const getPathname = useGetPathname();

  const past = !!location.pathname.includes('/past');

  const [selectedFilterValues, setSelectedFilterValues] =
    useState<FilterValues>(initialFilterValues);

  const variables = {
    id: eventId,
    childId: childId,
  };

  const {
    loading,
    error: queryError,
    data,
    refetch,
  } = useQuery<EventQuery>(eventQuery, {
    skip: !eventId || !childId,
    variables,
  });

  const {
    loading: hasAnyFreePasswordsQueryLoading,
    error: hasAnyFreePasswordsQueryError,
    data: hasAnyFreePasswordsQueryData,
  } = useQuery<EventExternalTicketSystemHasAnyFreePasswordsQuery>(
    eventExternalTicketSystemHasAnyFreePasswordsQuery,
    {
      variables: { id: eventId },
      fetchPolicy: 'network-only',
    }
  );

  const hasAnyFreePasswordsTicketSystem =
    hasAnyFreePasswordsQueryData?.event?.ticketSystem;
  const hasFreePasswords = !!(hasAnyFreePasswordsTicketSystem &&
  'hasAnyFreePasswords' in hasAnyFreePasswordsTicketSystem
    ? hasAnyFreePasswordsTicketSystem?.hasAnyFreePasswords
    : null);

  const updateFilterValues = (filterValues: FilterValues) => {
    // If date or time is missing we force it to be present and undefined to
    // work around this apollo bug:
    // https://github.com/apollographql/react-apollo/issues/2300
    // Without it you would not be able to go from having a date or time
    // filter to seeing all occurrences again.
    filterValues.date = filterValues.date ? filterValues.date : undefined;
    filterValues.time = filterValues.time ? filterValues.time : undefined;
    setSelectedFilterValues(filterValues);
    refetch({ ...filterValues, ...variables });
  };

  // Use allOccurrences so that filtering does not affect options
  const optionsDates = getDateOptions(data?.event?.allOccurrences);
  const optionsTimes = getTimeOptions(data?.event?.allOccurrences);

  if (loading || hasAnyFreePasswordsQueryLoading)
    return <LoadingSpinner isLoading={true} />;

  const error = queryError ?? hasAnyFreePasswordsQueryError;
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
  const isExternalTicketSystem = externalTicketSystems.includes(
    event?.ticketSystem?.type as TicketSystem
  );

  const continueUrl = getPathname(
    `/profile/child/${childId}/event/${eventId}/redirect`
  );

  return (
    <EventPage event={event} backTo={goBackTo}>
      <EventParticipantsPerInvite
        participantsPerInvite={event.participantsPerInvite}
      />
      <div className={styles.description}>
        <Paragraph text={event.description ?? ''} />
      </div>
      {!past &&
        (!isExternalTicketSystem ? (
          <EventEnrol
            data={data}
            filterValues={selectedFilterValues}
            options={{
              dates: optionsDates,
              times: optionsTimes,
            }}
            onFilterUpdate={updateFilterValues}
          />
        ) : (
          <ExternalTicketSystemEventEnrol
            enrolmentDeniedReason={event.enrolmentDeniedReason}
            registrationOpensAt={event.registrationOpensAt}
            hasFreePasswords={hasFreePasswords}
            continueUrl={continueUrl}
          />
        ))}
    </EventPage>
  );
};

export default Event;
