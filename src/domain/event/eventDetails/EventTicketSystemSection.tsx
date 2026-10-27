import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { Notification } from 'hds-react';
import { ContentContainer } from '@city-of-helsinki/react-helsinki-headless-cms';

import Button from '../../../common/components/button/Button';
import AnchorButton from '../../../common/components/button/AnchorButton';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import ExternalTicketSystemPassword from '../ExternalTicketSystemPassword';
import { getEnrolmentDeniedNotice } from '../EventUtils';
import {
  AssignTicketSystemPasswordMutation,
  AssignTicketSystemPasswordMutationVariables,
  EnrolmentDeniedReason,
  EventExternalTicketSystemHasAnyFreePasswordsQuery,
  EventExternalTicketSystemHasAnyFreePasswordsQueryVariables,
  EventParticipantsPerInvite,
  TicketSystem,
} from '../../api/generatedTypes/graphql';
import {
  eventExternalTicketSystemHasAnyFreePasswordsQuery,
} from '../queries/eventQuery';
import assignTicketSystemPasswordMutation from '../mutations/assignTicketSystemPasswordMutation';
import getTicketSystemPasswordRefetchQueries from '../getTicketSystemPasswordRefetchQueries';
import styles from './eventTicketSystemSection.module.scss';

export type EventTicketSystemSectionEvent = {
  id: string;
  name?: string | null;
  enrolmentDeniedReason?: EnrolmentDeniedReason | null;
  registrationOpensAt?: string | null;
  participantsPerInvite?: EventParticipantsPerInvite | null;
  ticketSystem?: {
    type: TicketSystem;
    childPassword?: string | null;
    url?: string | null;
  } | null;
};

export type EventTicketSystemSectionProps = {
  event: EventTicketSystemSectionEvent;
  childId: string;
};


export const EventTicketSystemSection: React.FC<
  EventTicketSystemSectionProps
> = ({ event, childId }) => {
  const { t } = useTranslation();
  const [assignedPassword, setAssignedPassword] = useState<string | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);

  const activePassword =
    assignedPassword ?? event.ticketSystem?.childPassword ?? null;
  const ticketSystemUrl = event.ticketSystem?.url ?? null;

  const {
    data: freePasswordsData,
    loading: isCheckingFreePasswords,
    error: freePasswordsError,
  } = useQuery<
    EventExternalTicketSystemHasAnyFreePasswordsQuery,
    EventExternalTicketSystemHasAnyFreePasswordsQueryVariables
  >(eventExternalTicketSystemHasAnyFreePasswordsQuery, {
    skip:
      !event.id ||
      Boolean(activePassword) ||
      Boolean(event.enrolmentDeniedReason),
    variables: { id: event.id },
    fetchPolicy: 'network-only',
  });

  const [assignTicketSystemPassword, { loading: isAssigning }] = useMutation<
    AssignTicketSystemPasswordMutation,
    AssignTicketSystemPasswordMutationVariables
  >(assignTicketSystemPasswordMutation, {
    refetchQueries: getTicketSystemPasswordRefetchQueries({
      eventId: event.id,
      childId,
    }),
    awaitRefetchQueries: false,
    onError: (err) => {
      const code = err.graphQLErrors?.[0]?.extensions?.code;
      if (code === 'NO_FREE_TICKET_SYSTEM_PASSWORDS_ERROR') {
        setAssignError(
          t(
            'eventRedirectPage.noFreeTicketSystemPasswordsLeftLabel',
            'Valitettavasti salasanoja ei ole enää jäljellä'
          )
        );
      } else {
        setAssignError(
          err.message ||
            t(
              'eventRedirectPage.unexpectedError',
              'Odottamaton virhe salasanan lunastamisessa.'
            )
        );
      }
    },
  });

  const handleClaimPassword = async () => {
    setAssignError(null);
    try {
      const res = await assignTicketSystemPassword({
        variables: {
          input: {
            eventId: event.id,
            childId,
            clientMutationId: null,
          },
        },
      });
      const newPassword =
        res.data?.assignTicketSystemPassword?.password ?? null;
      if (newPassword) {
        setAssignedPassword(newPassword);
      }
    } catch {
      // Handled in onError callback
    }
  };

  const freePasswordsTicketSystem = freePasswordsData?.event?.ticketSystem;
  const hasFreePasswords = Boolean(
    freePasswordsTicketSystem &&
      'hasAnyFreePasswords' in freePasswordsTicketSystem &&
      freePasswordsTicketSystem.hasAnyFreePasswords
  );

  const registrationNotOpenText = getEnrolmentDeniedNotice({
    t,
    enrolmentDeniedReason: EnrolmentDeniedReason.RegistrationNotOpen,
    registrationOpensAt: event.registrationOpensAt,
  });

  const participantsText = event.participantsPerInvite
    ? t('externalTicketSystemEvent.participantsPerInviteText', {
        participantsPerInvite: t(
          `event.participantsPerInviteEnum.${event.participantsPerInvite}`
        ),
      })
    : null;

  const renderPasswordAcquireActions = () => {
    if (isCheckingFreePasswords) {
      return <LoadingSpinner isLoading={true} />;
    }

    if (hasFreePasswords) {
      return (
        <div className={styles.actionsRow}>
          <Button
            onClick={handleClaimPassword}
            disabled={isAssigning}
            data-testid="claim-password-button"
          >
            {t(
              'eventRedirectPage.continue',
              'Kyllä, lunastan salasanan!'
            )}
          </Button>
        </div>
      );
    }

    return (
      <p className={styles.noFreePasswords}>
        {t(
          'eventRedirectPage.noFreeTicketSystemPasswordsLeftLabel',
          'Valitettavasti salasanoja ei ole enää jäljellä'
        )}
      </p>
    );
  };

  const renderSectionContent = () => {
    if (activePassword) {
      return (
        <div className={styles.card} data-testid="ticket-system-password-card">
          <h3 className={styles.subHeading}>
            {t('eventRedirectPage.passwordLabel', 'Henkilökohtainen salasanasi:')}
          </h3>
          <ExternalTicketSystemPassword password={activePassword} />
          <p className={styles.cardDescription}>
            {t(
              'eventRedirectPage.passwordCopyDescription',
              'Kopioi salasana ja jatka sitten kummilapsipalvelun ulkoiseen lipunmyyntipalveluun.'
            )}
          </p>

          {participantsText && (
            <p className={styles.participantsText}>{participantsText}</p>
          )}

          <div className={styles.actionsRow}>
            {ticketSystemUrl ? (
              <AnchorButton
                href={ticketSystemUrl}
                openInNewTab
                className={styles.continueButton}
              >
                {t(
                  'externalTicketSystemEvent.continueButton',
                  'Jatka ulkoiseen lipunmyyntipalveluun'
                )}
              </AnchorButton>
            ) : (
              <p className={styles.cardDescription}>
                {registrationNotOpenText}
              </p>
            )}
          </div>

          <p className={styles.extraInfo}>
            {t(
              'externalTicketSystemEvent.extraInfo',
              'Mikäli et varaa paikkoja nyt, löydät salasanasi ' +
                'myöhempää käyttöä varten lapsen tulevista tapahtumista.'
            )}
          </p>
        </div>
      );
    }

    if (event.enrolmentDeniedReason) {
      return (
        <div className={styles.notificationWrapper}>
          <Notification type="alert">
            {getEnrolmentDeniedNotice({
              t,
              enrolmentDeniedReason: event.enrolmentDeniedReason,
              registrationOpensAt: event.registrationOpensAt,
            })}
          </Notification>
        </div>
      );
    }

    return (
      <div className={styles.card} data-testid="ticket-system-acquire-card">
        <h3 className={styles.subHeading}>
          {t(
            'eventRedirectPage.passwordAcquireHeading',
            'Henkilökohtainen salasana'
          )}
        </h3>
        <p className={styles.cardDescription}>
          {t(
            'eventRedirectPage.passwordAcquireDescription',
            'Seuraavassa vaiheessa saat henkilökohtaisen salasanan, ' +
              'jolla pääset varaamaan liput ulkoisesta lipunmyyntipalvelusta.'
          )}
        </p>

        {participantsText && (
          <p className={styles.participantsText}>{participantsText}</p>
        )}

        {renderPasswordAcquireActions()}
      </div>
    );
  };

  return (
    <section
      id="ticket-system-section"
      className={styles.ticketSystemSection}
      aria-labelledby="ticket-system-heading"
    >
      <ContentContainer>
        <hr className={styles.divider} />
        <h2 id="ticket-system-heading" className={styles.heading}>
          {t('eventRedirectPage.title', 'Ilmoittaudu tapahtumaan')}
        </h2>
        <p className={styles.description}>
          {t(
            'eventRedirectPage.description',
            'Tapahtumaan ilmoittaudutaan kummilapsipalvelun ulkoisessa lipunmyyntipalvelussa.'
          )}
        </p>

        {assignError && (
          <div className={styles.notificationWrapper}>
            <Notification
              type="error"
              label={t('common.error.title', 'Virhe')}
              closeButtonLabelText={t('common.close', 'Sulje')}
              onClose={() => setAssignError(null)}
            >
              {assignError}
            </Notification>
          </div>
        )}

        {freePasswordsError && (
          <div className={styles.notificationWrapper}>
            <Notification
              type="alert"
              label={t('common.error.title', 'Virhe')}
            >
              {freePasswordsError.message}
            </Notification>
          </div>
        )}

        {renderSectionContent()}
      </ContentContainer>
    </section>
  );
};

export default EventTicketSystemSection;
