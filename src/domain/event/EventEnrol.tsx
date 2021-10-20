import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';

import FormikDropdown from '../../common/components/formikWrappers/FormikDropdown';
import { eventQuery as EventQueryType } from '../api/generatedTypes/eventQuery';
import EventOccurrenceList from './EventOccurrenceList';
import { FilterValues, FilterOptions } from './Event';
import styles from './event.module.scss';
import { TicketSystem } from '../api/generatedTypes/globalTypes';

export type EventEnrolProps = {
  data: EventQueryType;
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

  const isTicketmasterTicketingSystem =
    data?.event?.ticketSystem?.type === TicketSystem.TICKETMASTER;

  return (
    <>
      <h2>{t('enrollPage.enrolShort')}</h2>
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
          showFreePlaces={!isTicketmasterTicketingSystem}
        />
      )}
    </>
  );
};

export default EventEnrol;
