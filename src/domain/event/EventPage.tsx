import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Icon from '../../common/components/icon/Icon';
import styles from './event.module.scss';
import PageWrapper from '../app/layout/PageWrapper';
import backIcon from '../../assets/icons/svg/arrowLeft.svg';
import { eventQuery_event as EventQueryType } from '../api/generatedTypes/eventQuery';
import { occurrenceQuery_occurrence_event as OccurrenceQueryType } from '../api/generatedTypes/occurrenceQuery';
// eslint-disable-next-line max-len
import { externalTicketSystemEventQuery_event as ExternalTicketSystemEventQueryType } from '../api/generatedTypes/externalTicketSystemEventQuery';

type EventProps = {
  event:
    | EventQueryType
    | OccurrenceQueryType
    | ExternalTicketSystemEventQueryType;
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
            {backTo && (
              <Link
                aria-label={t('common.backButton.label')}
                className={styles.backButton}
                to={backTo}
              >
                <Icon src={backIcon} className={styles.backButtonIcon} />
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
