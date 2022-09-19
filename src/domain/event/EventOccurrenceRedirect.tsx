import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/client';

import PageWrapper from '../app/layout/PageWrapper';
import Text from '../../common/components/text/Text';
import LinkButton from '../../common/components/button/LinkButton';
import AnchorButton from '../../common/components/button/AnchorButton';
import { eventQuery as EventQueryType } from '../api/generatedTypes/eventQuery';
import eventQuery from './queries/eventQuery';
import styles from './eventOccurrenceRedirect.module.scss';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import InfoPageLayout from '../app/layout/InfoPageLayout';
import useEventOccurrence from './queries/useEventOccurrence';
import useGetPathname from '../../common/route/utils/useGetPathname';
import TicketmasterPassword from './TicketmasterPassword';

type Params = {
  eventId: string;
  occurrenceId: string;
  childId: string;
};

const EventOccurrenceRedirect = () => {
  const { t } = useTranslation();
  const params = useParams<Params>();

  const getPathname = useGetPathname();

  const { loading, error, data } = useQuery<EventQueryType>(eventQuery, {
    variables: {
      id: params.eventId,
      childId: params.childId,
    },
  });
  const occurrenceResult = useEventOccurrence(
    params.occurrenceId,
    params.childId
  );

  const ticketSystem = data?.event?.ticketSystem;
  const ticketmasterPassword =
    ticketSystem && 'childPassword' in ticketSystem
      ? ticketSystem.childPassword
      : null;
  const occurrenceTicketSystem =
    occurrenceResult?.data?.occurrence?.ticketSystem;
  const ticketmasterUrl =
    occurrenceTicketSystem && 'url' in occurrenceTicketSystem
      ? occurrenceTicketSystem.url
      : null;

  if (loading) {
    return <LoadingSpinner isLoading={true} />;
  }

  if (error) {
    return (
      <InfoPageLayout
        title={t('eventOccurrenceRedirectPage.unexpectedError')}
        description={error.toString()}
      />
    );
  }

  const event = data?.event;

  return (
    <PageWrapper className={styles.grey}>
      <div className={styles.wrapper}>
        <Text as="h1" variant="h2">
          {t('eventOccurrenceRedirectPage.title')}
        </Text>
        <Text variant="body-l">
          {t('eventOccurrenceRedirectPage.description', {
            eventName: event?.name,
          })}
        </Text>
        <Text variant="body-l" className={styles.lessMargin}>
          {t('eventOccurrenceRedirectPage.passwordLabel')}
        </Text>
        <div className={styles.row}>
          <TicketmasterPassword password={ticketmasterPassword} />
        </div>
        <div className={styles.row}>
          <LinkButton
            variant="secondary"
            to={getPathname(
              `/profile/child/${params.childId}/event/${params.eventId}`
            )}
          >
            {t('eventOccurrenceRedirectPage.back')}
          </LinkButton>
          <AnchorButton href={ticketmasterUrl}>
            {t('eventOccurrenceRedirectPage.continue')}
          </AnchorButton>
        </div>
      </div>
    </PageWrapper>
  );
};

export default EventOccurrenceRedirect;
