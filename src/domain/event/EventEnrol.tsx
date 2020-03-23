import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import Icon from '../../common/components/icon/Icon';
import styles from './event.module.scss';
import personIcon from '../../assets/icons/svg/person.svg';
import EnhancedInputField from '../../common/components/form/fields/input/EnhancedInputField';
import SelectField from '../../common/components/form/fields/select/SelectField';
import { eventQuery as EventQueryType } from '../api/generatedTypes/eventQuery';
import EventOccurrenceList from './EventOccurrenceList';
import { formatOccurrenceTime } from './EventUtils';
import { formatTime, newMoment } from '../../common/time/utils';
import { DEFAULT_DATE_FORMAT } from '../../common/time/TimeConstants';

export interface FilterValues {
  date?: string;
  time?: string;
}

export interface EventEnrolProps {
  data: EventQueryType;
  onFilterUpdate: (filterValues: FilterValues) => void;
}

const EventEnrol: FunctionComponent<EventEnrolProps> = ({
  data,
  onFilterUpdate,
}) => {
  const { t } = useTranslation();

  const handleSubmit = (filterValues: FilterValues) => {
    const z: FilterValues = {};
    if (filterValues.date) z.date = filterValues.date;
    if (filterValues.time) z.time = filterValues.time;
    onFilterUpdate(z);
  };

  if (!data?.event) return <div></div>;

  const selectOptionsDate = data.event.occurrences.edges
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
        : {};
    })
    .filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);
  const selectOptionsTime = data.event.occurrences.edges
    .map(occurrence => {
      return occurrence?.node?.id && occurrence.node.time
        ? {
            value: formatTime(newMoment(occurrence.node.time), 'HH:mm'),
            label: formatOccurrenceTime(
              occurrence.node.time,
              data.event?.duration || null
            ),
            key: occurrence?.node.id,
          }
        : {};
    })
    .filter((v, i, a) => a.findIndex(t => t.value === v.value) === i)
    .sort((a, b) => {
      return a.label && b.label
        ? a.label === b.label
          ? 0
          : +(a.label > b.label) || -1
        : 0;
    });

  const participantsPerInvite = data.event.participantsPerInvite
    ? t(`event.participantsPerInviteEnum.${data.event.participantsPerInvite}`)
    : '';

  return (
    <>
      <div className={styles.register}>
        <h2>{t('event.register.form.header')}</h2>
        <div className={styles.attendees}>
          <Icon src={personIcon} className={styles.icon} />
          {participantsPerInvite}
        </div>
        <div className={styles.signup}>
          <Formik
            key="eventPageFormKey"
            initialValues={{
              date: '',
              time: '',
            }}
            onSubmit={handleSubmit}
            validate={(values: FilterValues) => {
              handleSubmit(values);
            }}
          >
            {({ handleSubmit, handleChange, values }) => {
              return (
                <form onSubmit={handleSubmit} id="eventPageForm">
                  <EnhancedInputField
                    className={styles.dateField}
                    id="date"
                    name="date"
                    placeholder="placeholder"
                    label="Choose date"
                    options={selectOptionsDate}
                    component={SelectField}
                    value={values.date}
                  />
                  <EnhancedInputField
                    className={styles.timeField}
                    id="time"
                    name="time"
                    placeholder="placeholdertime"
                    label="Choose time"
                    options={selectOptionsTime}
                    component={SelectField}
                    value={values.time}
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
      {data.event.occurrences.edges && (
        <EventOccurrenceList
          occurrences={data.event.occurrences}
          eventId={data.event.id}
        />
      )}
    </>
  );
};

export default EventEnrol;
