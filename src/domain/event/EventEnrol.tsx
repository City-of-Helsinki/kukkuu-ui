import React from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Field } from 'formik';

import Icon from '../../common/components/icon/Icon';
import styles from './event.module.scss';
import personIcon from '../../assets/icons/svg/person.svg';
import { eventQuery as EventQueryType } from '../api/generatedTypes/eventQuery';
import EventOccurrenceList from './EventOccurrenceList';
import { FilterValues, FilterOptions } from './Event';
import FormikDropdown, {
  HdsOptionType,
} from '../../common/components/formikWrappers/FormikDropdown';
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
            {({ handleSubmit, setFieldValue, values }) => {
              return (
                <form onSubmit={handleSubmit} id="eventPageForm">
                  <Field
                    as={FormikDropdown}
                    className={styles.dateField}
                    id="date"
                    name="date"
                    placeholder={t('common.select.default.text')}
                    onChange={(option: HdsOptionType) =>
                      setFieldValue('date', option.value)
                    }
                    label={t('enrollment.selectDate')}
                    options={[
                      { value: '', label: t('common.select.all.text') },
                      ...options.dates,
                    ]}
                    default={values.date}
                  />
                  <Field
                    as={FormikDropdown}
                    className={styles.timeField}
                    id="time"
                    name="time"
                    placeholder={t('common.select.default.text')}
                    onChange={(option: HdsOptionType) =>
                      setFieldValue('time', option.value)
                    }
                    label={t('enrollment.selectTime')}
                    options={[
                      { value: '', label: t('common.select.all.text') },
                      ...options.times,
                    ]}
                    default={values.time}
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
