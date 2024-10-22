import { Trans, useTranslation } from 'react-i18next';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';

import PageWrapper from '../app/layout/PageWrapper';
import Text from '../../common/components/text/Text';
import LinkButton from '../../common/components/button/LinkButton';
import AnchorButton from '../../common/components/button/AnchorButton';
import {
  ExternalTicketSystemEventQuery,
  EventExternalTicketSystemPasswordCountQuery,
  AssignTicketSystemPasswordMutation,
  AssignTicketSystemPasswordMutationVariables,
} from '../api/generatedTypes/graphql';
import { eventExternalTicketSystemPasswordQuery } from './queries/eventQuery';
import assignTicketSystemPasswordMutation from './mutations/assignTicketSystemPasswordMutation';
import eventExternalTicketSystemPasswordCountQuery from './queries/eventExternalTicketSystemPasswordCountQuery';
import styles from './eventRedirect.module.scss';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import InfoPageLayout from '../app/layout/InfoPageLayout';
import useGetPathname from '../../common/route/utils/useGetPathname';
import ExternalTicketSystemPassword from './ExternalTicketSystemPassword';
import Button from '../../common/components/button/Button';
import client from '../api/client';

type Params = {
  eventId: string;
  childId: string;
};

const useEventExternalTicketSystemPasswordQuery = ({
  eventId,
  childId,
}: Params) => {
  return useQuery<ExternalTicketSystemEventQuery>(
    eventExternalTicketSystemPasswordQuery,
    {
      skip: !eventId || !childId,
      variables: {
        id: eventId,
        childId,
      },
      fetchPolicy: 'network-only',
    }
  );
};

const useEventExternalTicketSystemPasswordCountQuery = ({
  eventId,
}: Pick<Params, 'eventId'>) => {
  return useQuery<EventExternalTicketSystemPasswordCountQuery>(
    eventExternalTicketSystemPasswordCountQuery,
    {
      skip: !eventId,
      variables: { id: eventId },
      fetchPolicy: 'network-only',
    }
  );
};

const useAssignTicketSystemPasswordMutation = ({
  eventId,
  childId,
}: Params) => {
  return useMutation<
    AssignTicketSystemPasswordMutation,
    AssignTicketSystemPasswordMutationVariables
  >(assignTicketSystemPasswordMutation, {
    variables: {
      input: {
        eventId,
        childId,
        clientMutationId: null,
      },
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
    onCompleted: (data) => {
      // Because it is not trivial to figure out how to invalidate exactly all the
      // needed parts of the cache, and invalidating the whole thing doesn't cause any
      // actual harm in practice as this is such a rare action and the user is probably
      // going away anyway, better to be safe than sorry and wipe the whole thing.
      client.clearStore();
    },
  });
};

const ConfirmRequestingExternalTicketSystemPassword = ({
  backUrl,
  hasFreePasswords,
  assignTicketSystemPassword,
}: {
  backUrl: string;
  hasFreePasswords: boolean;
  assignTicketSystemPassword: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.acquireButtonRow}>
      <LinkButton variant="secondary" to={backUrl}>
        {t('eventRedirectPage.back')}
      </LinkButton>
      {hasFreePasswords ? (
        <Button onClick={() => assignTicketSystemPassword()}>
          {t('eventRedirectPage.continue')}
        </Button>
      ) : (
        <Text
          variant="body-l"
          className={styles.noFreeTicketSystemPasswordsLeftLabel}
        >
          {t('eventRedirectPage.noFreeTicketSystemPasswordsLeftLabel')}
        </Text>
      )}
    </div>
  );
};

const ExternalTicketSystemPasswordDetails = ({
  externalTicketSystemPassword,
  ticketSystemUrl,
}: {
  externalTicketSystemPassword: string;
  ticketSystemUrl: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.passwordWrapper}>
      <hr />
      <Text variant="body-l">{t('eventRedirectPage.passwordLabel')}</Text>
      <ExternalTicketSystemPassword password={externalTicketSystemPassword} />
      <Text variant="body-l">
        {t('eventRedirectPage.passwordCopyDescription')}
      </Text>
      <AnchorButton
        className={styles.continueButton}
        href={ticketSystemUrl}
        openInNewTab
      >
        {t('externalTicketSystemEvent.continueButton')}
      </AnchorButton>
      <Text variant="body-l">{t('externalTicketSystemEvent.extraInfo')}</Text>
    </div>
  );
};

const TicketSystemError = ({
  error,
  backUrl,
}: {
  error: ApolloError;
  backUrl: string;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isNoFreeTicketSystemPasswordsError =
    error.graphQLErrors.length > 0 &&
    error.graphQLErrors[0].extensions.code ===
      'NO_FREE_TICKET_SYSTEM_PASSWORDS_ERROR';

  React.useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  if (isNoFreeTicketSystemPasswordsError) {
    return (
      <InfoPageLayout
        title={t('eventRedirectPage.noFreeTicketSystemPasswordsErrorTitle')}
        description={
          <Trans i18nKey="eventRedirectPage.noFreeTicketSystemPasswordsErrorDescription" />
        }
        callToAction={{
          label: t('eventRedirectPage.back'),
          onClick: () => navigate(backUrl),
        }}
      />
    );
  }
  return (
    <InfoPageLayout
      title={t('eventRedirectPage.unexpectedError')}
      description={error.message}
    />
  );
};

const EventRedirect = () => {
  const { t } = useTranslation();
  const { eventId = '', childId = '' } = useParams<Params>();

  const getPathname = useGetPathname();

  const {
    error: queryError,
    data: queryData,
    loading: queryLoading,
  } = useEventExternalTicketSystemPasswordQuery({ eventId, childId });

  const {
    loading: passwordCountQueryLoading,
    error: passwordCountQueryError,
    data: passwordCountQueryData,
  } = useEventExternalTicketSystemPasswordCountQuery({ eventId });

  const [
    assignTicketSystemPassword,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useAssignTicketSystemPasswordMutation({ eventId, childId });

  // Get the external ticket system password from either the query or the mutation's response.
  // Normally the user will land on this page without a password, so the query's
  // password will be null, but in some special occasions, like when reloading the page,
  // the query might already return the password.
  const ticketSystem = queryData?.event?.ticketSystem;
  const externalTicketSystemPassword =
    (ticketSystem && 'childPassword' in ticketSystem
      ? ticketSystem.childPassword
      : null) ?? mutationData?.assignTicketSystemPassword?.password;

  const passwordCountTicketSystem = passwordCountQueryData?.event?.ticketSystem;
  const hasFreePasswords = !!(passwordCountTicketSystem &&
  'freePasswordCount' in passwordCountTicketSystem
    ? passwordCountTicketSystem?.freePasswordCount
    : null);

  if (queryLoading || passwordCountQueryLoading || !eventId || !childId) {
    return <LoadingSpinner isLoading={true} />;
  }

  const ticketSystemUrl =
    ticketSystem && 'url' in ticketSystem ? ticketSystem.url : '#';
  const backUrl = getPathname(`/profile/child/${childId}/event/${eventId}`);

  const error = queryError ?? mutationError ?? passwordCountQueryError;
  if (error) {
    return <TicketSystemError error={error} backUrl={backUrl} />;
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
          {t('externalTicketSystemEvent.participantsPerInviteText', {
            participantsPerInvite: t(
              `event.participantsPerInviteEnum.${event?.participantsPerInvite}`
            ),
          })}
        </Text>
        <LoadingSpinner isLoading={mutationLoading}>
          {!externalTicketSystemPassword ? (
            <ConfirmRequestingExternalTicketSystemPassword
              backUrl={backUrl}
              hasFreePasswords={hasFreePasswords}
              assignTicketSystemPassword={assignTicketSystemPassword}
            />
          ) : (
            <ExternalTicketSystemPasswordDetails
              externalTicketSystemPassword={externalTicketSystemPassword}
              ticketSystemUrl={ticketSystemUrl}
            />
          )}
        </LoadingSpinner>
      </div>
    </PageWrapper>
  );
};

export default EventRedirect;
