import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import { Notification } from 'hds-react';

import FormikDropdown from '../../common/components/formikWrappers/FormikDropdown';
import { EventQuery, TicketSystem } from '../api/generatedTypes/graphql';
import EventOccurrenceList from './EventOccurrenceList';
import { FilterValues, FilterOptions } from './Event';
import styles from './event.module.scss';
import { externalTicketSystems } from './constants/ExternalTicketSystemConstants';

export type EventEnrolProps = {
  data: EventQuery;
  filterValues: FilterValues;
  options: FilterOptions;
  onFilterUpdate: (filterValues: FilterValues) => void;
};

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

  const isExternalTicketSystem = externalTicketSystems.includes(
    data?.event?.ticketSystem?.type as TicketSystem
  );

  return (
    <>
      <h2>{t('enrollPage.enrolShort')}</h2>
      {!data?.event?.canChildEnroll && (
        <Notification type="alert">
          {t('enrollPage.message.cantEnrollNotice')}
        </Notification>
      )}
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
      {data.event.occurrences.edges && (
        <EventOccurrenceList
          occurrences={data.event.occurrences}
          showFreePlaces={!isExternalTicketSystem}
          canEnroll={data?.event?.canChildEnroll}
        />
      )}
    </>
  );
};

export default EventEnrol;
