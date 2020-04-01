import React, { FunctionComponent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Icon from '../../common/components/icon/Icon';
import styles from './event.module.scss';
import PageWrapper from '../app/layout/PageWrapper';
import backIcon from '../../assets/icons/svg/arrowLeft.svg';
import Button from '../../common/components/button/Button';
import { eventQuery as EventQueryType } from '../api/generatedTypes/eventQuery';
import {
  occurrenceQuery_occurrence_event as OccurrenceQueryTypeEvent,
  occurrenceQuery_occurrence as OccurrenceQueryType,
} from '../api/generatedTypes/occurrenceQuery';

export interface EventProps {
  eventData: EventQueryType | OccurrenceQueryTypeEvent;
  children: ReactNode;
}

const EventPage: FunctionComponent<
  EventQueryType | Pick<OccurrenceQueryType, 'event'>
> = ({ event, children }) => {
  const history = useHistory();
  const { t } = useTranslation();

  if (!event) return <></>;

  const backgroundImageStyle = event.image
    ? {
        backgroundImage: `url("${event.image}")`,
      }
    : {};

  return (
    <>
      <div
        className={styles.heroWrapper}
        style={backgroundImageStyle}
        title={event.imageAltText || ''}
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

      <PageWrapper className={styles.wrapper} title={event.name || ''}>
        <div className={styles.eventWrapper} role="main">
          <div className={styles.event}>
            <div className={styles.heading}>
              <h1>{event.name}</h1>
            </div>
            {children}
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default EventPage;
