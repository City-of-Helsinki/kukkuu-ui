import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import { useSelector } from 'react-redux';

import styles from './event.module.scss';
import PageWrapper from '../app/layout/PageWrapper';
import eventQuery from './queries/eventQuery';
import {
  eventQuery as EventQueryType,
  eventQueryVariables as EventQueryVariables,
} from '../api/generatedTypes/eventQuery';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { formatOccurrenceTime } from './EventUtils';
import { formatTime, newMoment } from '../../common/time/utils';
import {
  BACKEND_DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
} from '../../common/time/TimeConstants';
import EventEnrol from './EventEnrol';
import EventPage from './EventPage';
import Paragraph from '../../common/components/paragraph/Paragraph';
import { childrenEventSelector } from './state/EventSelectors';

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

const Event = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const params = useParams<{
    childId: string;
    eventId: string;
  }>();

  const past = location.pathname.includes('/past') ? true : false;

  const initialFilterValues: FilterValues = {
    date: '',
    time: '',
  };
  const [selectedFilterValues, setFilterValues] = useState(initialFilterValues);

  const [hasFiltered, setHasFiltered] = useState(false);
  const initialOptions: FilterOptions = {
    dates: [{ key: '', label: '', value: '' }],
    times: [{ key: '', label: '', value: '' }],
  };
  const [options, setOptions] = useState(initialOptions);

  const variables: EventQueryVariables = {
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

  const optionsDates = data.event.occurrences.edges
    .map((occurrence) => {
      return occurrence?.node?.id && occurrence.node.time
        ? {
            value: formatTime(
              newMoment(occurrence.node.time),
              BACKEND_DATE_FORMAT
            ),
            label: formatTime(
              newMoment(occurrence.node.time),
              DEFAULT_DATE_FORMAT
            ),
            key: occurrence.node.id,
          }
        : { key: '', label: '', value: '' };
    })
    .filter((v, i, a) => a.findIndex((t) => t.value === v.value) === i);

  const optionsTimes = data.event.occurrences.edges
    .map((occurrence) => {
      return occurrence?.node?.id && occurrence.node.time
        ? {
            value: formatTime(
              newMoment(occurrence.node.time),
              DEFAULT_TIME_FORMAT
            ),
            label: formatOccurrenceTime(
              occurrence.node.time,
              data.event?.duration || null
            ),
            key: occurrence.node.id,
          }
        : { key: '', label: '', value: '' };
    })
    .filter((v, i, a) => a.findIndex((t) => t.value === v.value) === i)
    .sort((a, b) => {
      return a.label && b.label
        ? a.label === b.label
          ? 0
          : +(a.label > b.label) || -1
        : 0;
    });

  if (!hasFiltered) {
    setOptions({
      dates: optionsDates,
      times: optionsTimes,
    });
    setHasFiltered(true);
  }

  return (
    <EventPage event={data.event}>
      <div className={styles.description}>
        <Paragraph text={data.event.description || ''} />
      </div>
      {!past && (
        <EventEnrol
          data={data}
          filterValues={selectedFilterValues}
          options={options}
          onFilterUpdate={updateFilterValues}
        />
      )}
    </EventPage>
  );
};

export default Event;
