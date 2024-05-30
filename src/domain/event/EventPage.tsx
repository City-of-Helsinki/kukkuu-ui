import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconArrowLeft } from 'hds-react';

import styles from './event.module.scss';
import PageWrapper from '../app/layout/PageWrapper';
import {
  EventQuery,
  ExternalTicketSystemEventQuery,
} from '../api/generatedTypes/graphql';
import { OccurrenceEvent } from './types/OccurrenceQueryTypes';

type EventProps = {
  event:
    | EventQuery['event']
    | OccurrenceEvent
    | ExternalTicketSystemEventQuery['event'];
  children?: ReactElement | Array<ReactElement | false>;
  success?: ReactElement;
  backTo?: string;
};

const EventPage = ({ event, children, success, backTo }: EventProps) => {
  const { t } = useTranslation();
  if (!event) return <></>;

  const backgroundImageStyle = event.image
    ? {
        backgroundImage: `url("${event.image}")`,
      }
    : {
        backgroundColor: 'var(--color-summer)',
      };

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
            {backTo && (
              <Link
                aria-label={t('common.backButton.label')}
                className={styles.backButton}
                to={backTo}
              >
                <IconArrowLeft className={styles.backButtonIcon} />
              </Link>
            )}
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
