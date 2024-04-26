import { Trans, useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import { useParams, useNavigate } from 'react-router-dom';

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

type Params = {
  eventId: string;
  childId: string;
};

const EventRedirect = () => {
  const { t } = useTranslation();
  const { eventId, childId } = useParams<Params>();
  const navigate = useNavigate();
  const getPathname = useGetPathname();

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery<ExternalTicketSystemEventQuery>(
    eventExternalTicketSystemPasswordQuery,
    {
      variables: {
        id: eventId,
        childId,
      },
      fetchPolicy: 'network-only',
    }
  );

  const {
    loading: passwordCountQueryLoading,
    error: passwordCountQueryError,
    data: passwordCountQueryData,
  } = useQuery<EventExternalTicketSystemPasswordCountQuery>(
    eventExternalTicketSystemPasswordCountQuery,
    {
      variables: { id: eventId },
      fetchPolicy: 'network-only',
    }
  );

  const [
    assignTicketSystemPassword,
    {
      data: mutationData,
      loading: mutationLoading,
      error: mutationError,
      client,
    },
  ] = useMutation<
    AssignTicketSystemPasswordMutation,
    AssignTicketSystemPasswordMutationVariables
  >(assignTicketSystemPasswordMutation, {
    variables: {
      input: {
        eventId: eventId ?? '',
        childId: childId ?? '',
        clientMutationId: null,
      },
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
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
  const externalTicketSystemPassword =
    (ticketSystem && 'childPassword' in ticketSystem
      ? ticketSystem.childPassword
      : null) || mutationData?.assignTicketSystemPassword?.password;

  const passwordCountTicketSystem = passwordCountQueryData?.event?.ticketSystem;
  const hasFreePasswords = !!(passwordCountTicketSystem &&
  'freePasswordCount' in passwordCountTicketSystem
    ? passwordCountTicketSystem?.freePasswordCount
    : null);

  const ticketSystemUrl =
    ticketSystem && 'url' in ticketSystem ? ticketSystem.url : undefined;
  const backUrl = getPathname(`/profile/child/${childId}/event/${eventId}`);

  if (queryLoading || passwordCountQueryLoading) {
    return <LoadingSpinner isLoading={true} />;
  }

  const error = queryError ?? mutationError ?? passwordCountQueryError;
  if (error) {
    const isNoFreeTicketSystemPasswordsError =
      error.graphQLErrors.length > 0 &&
      error.graphQLErrors[0].extensions.code ===
        'NO_FREE_TICKET_SYSTEM_PASSWORDS_ERROR';
    Sentry.captureException(error);
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
          {t('externalTicketSystemEvent.participantsPerInviteText', {
            participantsPerInvite: t(
              `event.participantsPerInviteEnum.${event?.participantsPerInvite}`
            ),
          })}
        </Text>
        {mutationLoading ? (
          <LoadingSpinner isLoading={true} />
        ) : !externalTicketSystemPassword ? (
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
        ) : (
          <div className={styles.passwordWrapper}>
            <hr />
            <Text variant="body-l">{t('eventRedirectPage.passwordLabel')}</Text>
            <ExternalTicketSystemPassword
              password={externalTicketSystemPassword}
            />
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
            <Text variant="body-l">
              {t('externalTicketSystemEvent.extraInfo')}
            </Text>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default EventRedirect;
