import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import * as Sentry from '@sentry/browser';

import Icon from '../../common/components/icon/Icon';
import styles from './event.module.scss';
import PageWrapper from '../app/layout/PageWrapper';
import personIcon from '../../assets/icons/svg/person.svg';
import backIcon from '../../assets/icons/svg/arrowLeft.svg';
import EnhancedInputField from '../../common/components/form/fields/input/EnhancedInputField';
import SelectField from '../../common/components/form/fields/select/SelectField';
import Button from '../../common/components/button/Button';
import eventQuery from './queries/eventQuery';
import { eventQuery as eventQueryType } from '../api/generatedTypes/eventQuery';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import EventOccurrenceList from './EventOccurrenceList';
interface SignupValues {
  date: string;
  time: string;
}

const Event: FunctionComponent = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const params = useParams<{ eventId: string }>();
  const { loading, error, data } = useQuery<eventQueryType>(eventQuery, {
    variables: {
      id: params.eventId,
    },
  });

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) {
    Sentry.captureException(error);
    return (
      <PageWrapper>
        <div className={styles.event}>{t('api.errorMessage')}</div>
      </PageWrapper>
    );
  }

  const initialValues: SignupValues = {
    date: '',
    time: '',
  };

  const handleSubmit = (values: SignupValues) => {
    // TODO: Do something like querying api again new filters
    // OR filter in js.
  };

  // TODO: Build options based on occurrences from the api
  const selectOptions = [
    { value: 1, label: 'one' },
    { value: 2, label: 'two' },
  ];

  const backgroundImageStyle = data?.event?.image
    ? {
        backgroundImage: `url("${data.event.image}")`,
      }
    : {};

  const participantsPerInvite = data?.event?.participantsPerInvite
    ? t(`event.participantsPerInviteEnum.${data.event.participantsPerInvite}`)
    : '';

  return (
    <>
      <div className={styles.heroWrapper} style={backgroundImageStyle}>
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

      <PageWrapper className={styles.wrapper} title={data?.event?.name || ''}>
        <div className={styles.eventWrapper} role="main">
          <div className={styles.event}>
            <div className={styles.heading}>
              <h1>{data?.event?.name}</h1>
            </div>
            <div className={styles.description}>{data?.event?.description}</div>
            <div className={styles.register}>
              <h2>{t('event.register.form.header')}</h2>
              <div className={styles.attendees}>
                <Icon src={personIcon} className={styles.icon} />
                {participantsPerInvite}
              </div>
              <div className={styles.signup}>
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  validate={(values: SignupValues) => {
                    handleSubmit(values);
                  }}
                >
                  {({ handleSubmit, handleChange }) => {
                    return (
                      <form onSubmit={handleSubmit} id="eventPageForm">
                        <EnhancedInputField
                          className={styles.dateField}
                          id="date"
                          name="date"
                          placeholder="placeholder"
                          label="Choose date"
                          options={selectOptions}
                          component={SelectField}
                        />
                        <EnhancedInputField
                          className={styles.timeField}
                          id="time"
                          name="time"
                          placeholder="placeholdertime"
                          label="Choose time"
                          options={selectOptions}
                          component={SelectField}
                        />
                      </form>
                    );
                  }}
                </Formik>
              </div>
            </div>
            {data?.event?.occurrences && (
              <EventOccurrenceList edges={data.event.occurrences.edges} />
            )}
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default Event;
