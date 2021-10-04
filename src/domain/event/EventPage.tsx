import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Icon from '../../common/components/icon/Icon';
import styles from './event.module.scss';
import PageWrapper from '../app/layout/PageWrapper';
import backIcon from '../../assets/icons/svg/arrowLeft.svg';
import { eventQuery_event as EventQueryType } from '../api/generatedTypes/eventQuery';
import { occurrenceQuery_occurrence_event as OccurrenceQueryType } from '../api/generatedTypes/occurrenceQuery';
import Button from '../../common/components/button/Button';

type EventProps = {
  event: EventQueryType | OccurrenceQueryType;
  children?: ReactElement | Array<ReactElement | false>;
  success?: ReactElement;
  goBack: React.MouseEventHandler<HTMLButtonElement>;
};

const EventPage = ({ event, children, success, goBack }: EventProps) => {
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
        {success}
        <div className={styles.backButtonWrapper}>
          <div className={styles.backButtonInnerWrapper}>
            <Button
              variant="secondary"
              aria-label={t('common.backButton.label')}
              className={styles.backButton}
              onClick={goBack}
            >
              <Icon src={backIcon} className={styles.backButtonIcon} />
            </Button>
          </div>
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
