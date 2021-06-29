import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import copy from 'copy-to-clipboard';
import { IconCheck } from 'hds-react';
import { useLocation, useParams } from 'react-router';
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

function getEventPathname(pathname: string): string {
  return pathname.split('/').slice(0, 7).join('/');
}

const CopyStates = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  error: 'ERROR',
} as const;

type CopyState = typeof CopyStates[keyof typeof CopyStates];

type Params = {
  eventId: string;
  childId: string;
};

const EventOccurrenceRedirect = () => {
  const { t } = useTranslation();
  const params = useParams<Params>();
  const { loading, error, data } = useQuery<EventQueryType>(eventQuery, {
    variables: {
      id: params.eventId,
      childId: params.childId,
    },
  });
  const location = useLocation();
  const [copyStatus, setCopyStatus] = useState<CopyState>(CopyStates.initial);
  const password = 'KUM98374';

  const handlePasswordCopy = () => {
    const success = copy(password);

    if (success) {
      setCopyStatus(CopyStates.success);
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
          <div className={styles.password}>{password}</div>
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
          <AnchorButton
            variant="secondary"
            href={getEventPathname(location.pathname)}
            className={styles.anchorButton}
          >
            {t('eventOccurrenceRedirectPage.back')}
          </AnchorButton>
          <LinkButton to="">
            {t('eventOccurrenceRedirectPage.continue')}
          </LinkButton>
        </div>
      </div>
    </PageWrapper>
  );
};

export default EventOccurrenceRedirect;
