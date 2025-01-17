import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import uniqBy from 'lodash/uniqBy';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { formatTime, newDate } from '../../common/time/utils';
import {
  BACKEND_DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from '../../common/time/TimeConstants';
import Paragraph from '../../common/components/paragraph/Paragraph';
import {
  EventQuery,
  TicketSystem,
  EventExternalTicketSystemHasAnyFreePasswordsQuery,
} from '../api/generatedTypes/graphql';
import RelayList from '../api/relayList';
import PageWrapper from '../app/layout/PageWrapper';
import eventQuery, {
  eventExternalTicketSystemHasAnyFreePasswordsQuery,
} from './queries/eventQuery';
import { formatOccurrenceTime } from './EventUtils';
import EventEnrol from './EventEnrol';
import EventPage from './EventPage';
import EventParticipantsPerInvite from './EventParticipantsPerInvite';
import styles from './event.module.scss';
import eventRedirectStyles from './eventRedirect.module.scss';
import { useEventRouteGoBackTo } from './route/EventRoute';
import LinkButton from '../../common/components/button/LinkButton';
import useGetPathname from '../../common/route/utils/useGetPathname';
import Text from '../../common/components/text/Text';
import { Occurrences, OccurrenceNode } from './types/EventQueryTypes';
import { externalTicketSystems } from './constants/ExternalTicketSystemConstants';

const OccurrenceList = RelayList<OccurrenceNode>();

export function getDateOptions(occurrences?: Occurrences) {
  const options = OccurrenceList(occurrences).items.map(({ id, time }) => ({
    value: formatTime(newDate(time), BACKEND_DATE_FORMAT),
    label: formatTime(newDate(time), DEFAULT_DATE_FORMAT),
    key: id,
  }));

  return uniqBy(options, 'value');
}

export function getTimeOptions(occurrences?: Occurrences) {
  const options = OccurrenceList(occurrences).items.map(
    ({ id, time, event }) => ({
      value: formatTime(newDate(time), DEFAULT_TIME_FORMAT),
      label: formatOccurrenceTime(time, event.duration || null),
      key: id,
    })
  );
  const uniqueOptions = uniqBy(options, 'value');

  return uniqueOptions.sort((a, b) => {
    return a.label && b.label
      ? a.label === b.label
        ? 0
        : +(a.label > b.label) || -1
      : 0;
  });
}

export interface FilterValues {
  date?: string;
  time?: string;
}

interface Option {
  key: string;
  label: string;
  value: string;
}

export interface FilterOptions {
  dates: Option[];
  times: Option[];
}

const initialFilterValues = {
  date: '',
  time: '',
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
          <>
            <hr className={styles.divider} />
            <div className={styles.externalTicketSystemButtons}>
              <LinkButton variant="secondary" to={goBackTo}>
                {t('event.externalTicketSystemButtons.back')}
              </LinkButton>
              {hasFreePasswords ? (
                <LinkButton variant="primary" to={continueUrl}>
                  {t('event.externalTicketSystemButtons.continue')}
                </LinkButton>
              ) : (
                <Text
                  variant="body-l"
                  className={
                    eventRedirectStyles.noFreeTicketSystemPasswordsLeftLabel
                  }
                >
                  {t('eventRedirectPage.noFreeTicketSystemPasswordsLeftLabel')}
                </Text>
              )}
            </div>
          </>
        ))}
    </EventPage>
  );
};

export default Event;
