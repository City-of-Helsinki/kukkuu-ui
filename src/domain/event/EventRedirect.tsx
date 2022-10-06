import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/client';
import * as Sentry from '@sentry/browser';

import PageWrapper from '../app/layout/PageWrapper';
import Text from '../../common/components/text/Text';
import LinkButton from '../../common/components/button/LinkButton';
import AnchorButton from '../../common/components/button/AnchorButton';
import { ticketmasterEventQuery as TicketmasterEventQueryType } from '../api/generatedTypes/ticketmasterEventQuery';
import { eventTicketmasterPasswordQuery } from './queries/eventQuery';
import assignTicketSystemPasswordMutation from './mutations/assignTicketSystemPasswordMutation';
import {
  assignTicketSystemPasswordMutation as assignTicketSystemMutationData,
  assignTicketSystemPasswordMutationVariables,
} from '../api/generatedTypes/assignTicketSystemPasswordMutation';
import styles from './eventRedirect.module.scss';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import InfoPageLayout from '../app/layout/InfoPageLayout';
import useGetPathname from '../../common/route/utils/useGetPathname';
import TicketmasterPassword from './TicketmasterPassword';
import Button from '../../common/components/button/Button';

type Params = {
  eventId: string;
  childId: string;
};

const EventRedirect = () => {
  const { t } = useTranslation();
  const { eventId, childId } = useParams<Params>();

  const getPathname = useGetPathname();

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery<TicketmasterEventQueryType>(eventTicketmasterPasswordQuery, {
    variables: {
      id: eventId,
      childId,
    },
    fetchPolicy: 'network-only',
  });

  const [
    assignTicketSystemPassword,
    {
      data: mutationData,
      loading: mutationLoading,
      error: mutationError,
      client,
    },
  ] = useMutation<
    assignTicketSystemMutationData,
    assignTicketSystemPasswordMutationVariables
  >(assignTicketSystemPasswordMutation, {
    variables: {
      input: {
        eventId,
        childId,
      },
    },
    onCompleted: async (data) => {
      // Because it is not trivial to figure out how to invalidate exactly all the
      // needed parts of the cache, and invalidating the whole thing doesn't cause any
      // actual harm in practice as this is such a rare action and the user is probably
      // going away anyway, better to be safe than sorry and wipe the whole thing.
      await client.clearStore();
    },
  });

  // Get the Ticketmaster password from either the query or the mutation's response.
  // Normally the user will land on this page without a password, so the query's
  // password will be null, but in some special occasions, like when reloading the page,
  // the query might already return the password.
  const ticketSystem = queryData?.event?.ticketSystem;
  const ticketmasterPassword =
    (ticketSystem && 'childPassword' in ticketSystem
      ? ticketSystem.childPassword
      : null) || mutationData?.assignTicketSystemPassword?.password;

  const ticketSystemUrl =
    ticketSystem && 'url' in ticketSystem ? ticketSystem.url : undefined;

  if (queryLoading) {
    return <LoadingSpinner isLoading={true} />;
  }

  const error = queryError || mutationError;
  if (error) {
    Sentry.captureException(error);
    return (
      <InfoPageLayout
        title={t('eventRedirectPage.unexpectedError')}
        description={error.toString()}
      />
    );
  }

  const event = queryData?.event;

  return (
    <PageWrapper className={styles.grey}>
      <div className={styles.wrapper}>
        <Text as="h1" variant="h2">
          {t('eventRedirectPage.title')}
        </Text>
        <Text variant="body-l">
          {t('eventRedirectPage.description', {
            eventName: event?.name,
          })}
        </Text>
        <Text as="h2" variant="h3">
          {t('eventRedirectPage.passwordAcquireHeading')}
        </Text>
        <Text variant="body-l">
          {t('eventRedirectPage.passwordAcquireDescription')}
        </Text>
        <Text variant="body-l">
          {t('ticketmasterEvent.participantsPerInviteText', {
            participantsPerInvite: t(
              `event.participantsPerInviteEnum.${event?.participantsPerInvite}`
            ),
          })}
        </Text>
        {mutationLoading ? (
          <LoadingSpinner isLoading={true} />
        ) : !ticketmasterPassword ? (
          <div className={styles.acquireButtonRow}>
            <LinkButton
              variant="secondary"
              to={getPathname(`/profile/child/${childId}/event/${eventId}`)}
            >
              {t('eventRedirectPage.back')}
            </LinkButton>
            <Button onClick={() => assignTicketSystemPassword()}>
              {t('eventRedirectPage.continue')}
            </Button>
          </div>
        ) : (
          <div className={styles.passwordWrapper}>
            <hr />
            <Text variant="body-l">{t('eventRedirectPage.passwordLabel')}</Text>
            <TicketmasterPassword password={ticketmasterPassword} />
            <Text variant="body-l">
              {t('eventRedirectPage.passwordCopyDescription')}
            </Text>
            <AnchorButton
              className={styles.continueButton}
              href={ticketSystemUrl}
              openInNewTab
            >
              {t('ticketmasterEvent.continueButton')}
            </AnchorButton>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default EventRedirect;
