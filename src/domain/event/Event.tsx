import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useParams, useLocation, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import { useSelector } from 'react-redux';
import uniqBy from 'lodash/uniqBy';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { formatTime, newMoment } from '../../common/time/utils';
import {
  BACKEND_DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from '../../common/time/TimeConstants';
import Paragraph from '../../common/components/paragraph/Paragraph';
import {
  eventQuery as EventQueryType,
  eventQuery_event_occurrences as Occurrences,
  eventQuery_event_occurrences_edges_node as OccurrenceNode,
} from '../api/generatedTypes/eventQuery';
import RelayList from '../api/relayList';
import PageWrapper from '../app/layout/PageWrapper';
import { childrenEventSelector } from './state/EventSelectors';
import eventQuery from './queries/eventQuery';
import { formatOccurrenceTime } from './EventUtils';
import EventEnrol from './EventEnrol';
import EventPage from './EventPage';
import EventParticipantsPerInvite from './EventParticipantsPerInvite';
import styles from './event.module.scss';
import { TicketSystem } from '../api/generatedTypes/globalTypes';

const OccurrenceList = RelayList<OccurrenceNode>();

export function getDateOptions(occurrences?: Occurrences) {
  const options = OccurrenceList(occurrences).items.map(({ id, time }) => ({
    value: formatTime(newMoment(time), BACKEND_DATE_FORMAT),
    label: formatTime(newMoment(time), DEFAULT_DATE_FORMAT),
    key: id,
  }));

  return uniqBy(options, 'value');
}

export function getTimeOptions(occurrences?: Occurrences) {
  const options = OccurrenceList(occurrences).items.map(
    ({ id, time, event }) => ({
      value: formatTime(newMoment(time), DEFAULT_TIME_FORMAT),
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

  const params = useParams<{
    childId: string;
    eventId: string;
  }>();

  const past = location.pathname.includes('/past') ? true : false;

  const [selectedFilterValues, setFilterValues] =
    useState<FilterValues>(initialFilterValues);

  const variables = {
    id: params.eventId,
    childId: params.childId,
  };

  const { loading, error, data, refetch } = useQuery<EventQueryType>(
    eventQuery,
    { variables }
  );

  const updateFilterValues = (filterValues: FilterValues) => {
    // If date or time is missing we force it to be present and undefined to
    // work around this apollo bug:
    // https://github.com/apollographql/react-apollo/issues/2300
    // Without it you would not be able to go from having a date or time
    // filter to seeing all occurrences again.
    filterValues.date = filterValues.date ? filterValues.date : undefined;
    filterValues.time = filterValues.time ? filterValues.time : undefined;
    setFilterValues(filterValues);
    refetch({ ...filterValues, ...variables });
  };

  // This page should not be available for children who are already
  // registered for this event (unless it is in the past, when it shows as archived)
  // The only way to come to this page is by using one of:
  // 1. back arrow button (shown on the page in desktop mode)
  // 2. browser back button
  // 3. bookmark / history

  // In this case we want to redirect back to the child detail page.

  // FIXME: Move this logic into a selector - IF you ever need it somewhere else.
  // Why not now? Because I don't want to move childId & eventId into state right now.
  const isRegistered = useSelector(childrenEventSelector)
    .filter((c) => c.childId === params.childId)
    .pop()
    ?.eventIds.some((e) => e === params.eventId);
  // Use allOccurrences so that filtering does not affect options
  const optionsDates = getDateOptions(data?.event?.allOccurrences);
  const optionsTimes = getTimeOptions(data?.event?.allOccurrences);

  // Child is registered for this event, redirect back to profile.
  // If the event is in the past, we show it as an "archive event".
  if (isRegistered && !past) {
    return <Redirect to={`/profile/child/${params.childId}`} />;
  }

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

  const isTicketmaster =
    data?.event?.ticketSystem?.type === TicketSystem.TICKETMASTER;

  return (
    <EventPage event={data.event}>
      <EventParticipantsPerInvite
        participantsPerInvite={data?.event?.participantsPerInvite}
      />
      <div className={styles.description}>
        <Paragraph text={data.event.description || ''} />
        {isTicketmaster && (
          <p>
            <Trans i18nKey="event.ticketmasterNotice" />{' '}
            <strong>
              <Trans
                i18nKey={`event.participantsPerInviteEnumLong.${data?.event?.participantsPerInvite}`}
              />
            </strong>
          </p>
        )}
      </div>
      {!past && (
        <EventEnrol
          data={data}
          filterValues={selectedFilterValues}
          options={{
            dates: optionsDates,
            times: optionsTimes,
          }}
          onFilterUpdate={updateFilterValues}
        />
      )}
    </EventPage>
  );
};

export default Event;
