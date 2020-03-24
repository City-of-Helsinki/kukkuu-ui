import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import * as Sentry from '@sentry/browser';

import Icon from '../../common/components/icon/Icon';
import styles from './event.module.scss';
import PageWrapper from '../app/layout/PageWrapper';
import backIcon from '../../assets/icons/svg/arrowLeft.svg';
import Button from '../../common/components/button/Button';
import eventQuery from './queries/eventQuery';
import {
  eventQuery as EventQueryType,
  eventQueryVariables as EventQueryVariables,
} from '../api/generatedTypes/eventQuery';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import { formatOccurrenceTime } from './EventUtils';
import { formatTime, newMoment } from '../../common/time/utils';
import { DEFAULT_DATE_FORMAT } from '../../common/time/TimeConstants';
import EventEnrol from './EventEnrol';
import Paragraph from '../../common/components/paragraph/Paragraph';

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

const Event: FunctionComponent = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const params = useParams<{ childId: string; eventId: string }>();

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

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) {
    Sentry.captureException(error);
    return (
      <PageWrapper>
        <div className={styles.event}>{t('api.errorMessage')}</div>
      </PageWrapper>
    );
  }

  if (!data?.event) return <div>No event</div>;

  const optionsDates = data.event.occurrences.edges
    .map(occurrence => {
      return occurrence?.node?.id && occurrence.node.time
        ? {
            value: formatTime(newMoment(occurrence.node.time), 'YYYY-MM-DD'),
            label: formatTime(
              newMoment(occurrence.node.time),
              DEFAULT_DATE_FORMAT
            ),
            key: occurrence.node.id,
          }
        : { key: '', label: '', value: '' };
    })
    .filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);

  const optionsTimes = data.event.occurrences.edges
    .map(occurrence => {
      return occurrence?.node?.id && occurrence.node.time
        ? {
            value: formatTime(newMoment(occurrence.node.time), 'HH:mm'),
            label: formatOccurrenceTime(
              occurrence.node.time,
              data.event?.duration || null
            ),
            key: occurrence.node.id,
          }
        : { key: '', label: '', value: '' };
    })
    .filter((v, i, a) => a.findIndex(t => t.value === v.value) === i)
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

  const backgroundImageStyle = data.event.image
    ? {
        backgroundImage: `url("${data.event.image}")`,
      }
    : {};

  return (
    <>
      <div
        className={styles.heroWrapper}
        style={backgroundImageStyle}
        title={data.event.imageAltText || ''}
      >
        <div className={styles.backButtonWrapper}>
          <Button
            aria-label={t('common.backButton.label')}
            className={styles.backButton}
            onClick={() => history.goBack()}
          >
            <Icon
              src={backIcon}
              className={styles.backButtonIcon}
              alt={t('common.backButton.label')}
            />
          </Button>
        </div>
      </div>

      <PageWrapper className={styles.wrapper} title={data.event.name || ''}>
        <div className={styles.eventWrapper} role="main">
          <div className={styles.event}>
            <div className={styles.heading}>
              <h1>{data.event.name}</h1>
            </div>
            <div className={styles.description}>
              <Paragraph text={data.event.description || ''} />
            </div>
            <EventEnrol
              data={data}
              filterValues={selectedFilterValues}
              options={options}
              onFilterUpdate={updateFilterValues}
            />
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default Event;
