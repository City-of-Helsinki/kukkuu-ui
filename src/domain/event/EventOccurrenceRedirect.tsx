import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import copy from 'copy-to-clipboard';
import { IconCheck } from 'hds-react';
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
import useAriaLive from '../../common/AriaLive/useAriaLive';
import useGetPathname from '../../common/route/utils/useGetPathname';

const CopyStates = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  error: 'ERROR',
} as const;

type CopyState = typeof CopyStates[keyof typeof CopyStates];

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
  const [copyStatus, setCopyStatus] = useState<CopyState>(CopyStates.initial);
  const { sendMessage } = useAriaLive();

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

  const handlePasswordCopy = () => {
    if (ticketmasterPassword) {
      const success = copy(ticketmasterPassword);

      // If copying was successful, true is returned. Otherwise the
      // copy-to-clipboard package will render a modal which advises the user
      // to copy by other means.
      if (success) {
        sendMessage(t('eventOccurrenceRedirectPage.passwordCopySuccess'));
        setCopyStatus(CopyStates.success);
      }
    }
  };

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
          <div className={styles.password}>{ticketmasterPassword}</div>
          <button
            type="button"
            onClick={handlePasswordCopy}
            className={styles.copyButton}
          >
            {t('eventOccurrenceRedirectPage.copyPassword')}
          </button>
          {copyStatus === CopyStates.success && (
            <IconCheck className={styles.successCheckMark} />
          )}
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
