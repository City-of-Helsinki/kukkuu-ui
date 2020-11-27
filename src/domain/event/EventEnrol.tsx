import React from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';

import personIcon from '../../assets/icons/svg/person.svg';
import Icon from '../../common/components/icon/Icon';
import FormikDropdown from '../../common/components/formikWrappers/FormikDropdown';
import { eventQuery as EventQueryType } from '../api/generatedTypes/eventQuery';
import EventOccurrenceList from './EventOccurrenceList';
import { FilterValues, FilterOptions } from './Event';
import styles from './event.module.scss';

export interface EventEnrolProps {
  data: EventQueryType;
  filterValues: FilterValues;
  options: FilterOptions;
  onFilterUpdate: (filterValues: FilterValues) => void;
}

const EventEnrol = ({
  data,
  filterValues,
  options,
  onFilterUpdate,
}: EventEnrolProps) => {
  const { t } = useTranslation();

  const handleSubmit = (filterValues: FilterValues) => {
    const z: FilterValues = {};
    if (filterValues.date) z.date = filterValues.date;
    if (filterValues.time) z.time = filterValues.time;
    onFilterUpdate(z);
  };

  if (!data?.event) return <div></div>;

  const participantsPerInvite = data.event.participantsPerInvite
    ? t(`event.participantsPerInviteEnum.${data.event.participantsPerInvite}`)
    : '';

  return (
    <>
      <div>
        <h2>{t('event.register.form.header')}</h2>
        <div className={styles.attendees}>
          <Icon
            src={personIcon}
            alt={t('event.register.participants')}
            className={styles.icon}
          />
          {participantsPerInvite}
        </div>
        <div className={styles.signup}>
          <Formik
            key="eventPageFormKey"
            initialValues={filterValues}
            onSubmit={handleSubmit}
            validate={(values: FilterValues) => {
              handleSubmit(values);
            }}
          >
            {() => {
              return (
                <Form noValidate id="eventPageForm">
                  <FormikDropdown
                    className={styles.dateField}
                    id="date"
                    name="date"
                    label={t('enrollment.selectDate')}
                    placeholder={t('common.select.default.text')}
                    options={[
                      { value: '', label: t('common.select.all.text') },
                      ...options.dates,
                    ]}
                  />
                  <FormikDropdown
                    className={styles.timeField}
                    id="time"
                    name="time"
                    label={t('enrollment.selectTime')}
                    placeholder={t('common.select.default.text')}
                    options={[
                      { value: '', label: t('common.select.all.text') },
                      ...options.times,
                    ]}
                  />
                </Form>
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
