import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import styles from './externalTicketSystemEventIsEnrolled.module.scss';
import { externalTicketSystemEventQuery } from './queries/externalTicketSystemEventQuery';
import { ExternalTicketSystemEventQuery } from '../api/generatedTypes/graphql';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import Paragraph from '../../common/components/paragraph/Paragraph';
import EventPage from './EventPage';
import ErrorMessage from '../../common/components/error/Error';
import AnchorButton from '../../common/components/button/AnchorButton';
import ExternalTicketSystemPassword from './ExternalTicketSystemPassword';
import Text from '../../common/components/text/Text';
import { useChildRouteGoBackTo } from '../profile/children/child/ProfileChildDetail';
import { TypeByTypename } from '../../common/commonUtils';

type TicketSystem = NonNullable<
  NonNullable<ExternalTicketSystemEventQuery['event']>['ticketSystem']
>;

type TicketSystemWithRequiredTypename = TicketSystem &
  Required<Pick<TicketSystem, '__typename'>>;

type TicketMasterEventTicketSystem = TypeByTypename<
  TicketSystemWithRequiredTypename,
  'TicketmasterEventTicketSystem'
>;

type LippupisteEventTicketSystem = TypeByTypename<
  TicketSystemWithRequiredTypename,
  'LippupisteEventTicketSystem'
>;

type EventTicketSystem =
  | TicketMasterEventTicketSystem
  | LippupisteEventTicketSystem;

const ExternalTicketSystemEventIsEnrolled = () => {
  const { t } = useTranslation();
  const goBackTo = useChildRouteGoBackTo();
  const params = useParams<{ childId: string; eventId: string }>();
  const { loading, error, data } = useQuery<ExternalTicketSystemEventQuery>(
    externalTicketSystemEventQuery,
    {
      variables: {
        eventId: params.eventId,
        childId: params.childId,
      },
    }
  );

  if (loading) return <LoadingSpinner isLoading={true} />;

  const errorMessage = <ErrorMessage message={t('api.errorMessage')} />;
  if (error || !data?.event) return errorMessage;

  const eventTicketSystem = data?.event.ticketSystem as EventTicketSystem;

  return (
    <EventPage event={data.event} backTo={goBackTo}>
      <div className={styles.description}>
        <Paragraph text={data.event.description || ''} />
      </div>
      <Text>{t('externalTicketSystemEvent.description')}</Text>
      <Text>{t('externalTicketSystemEvent.passwordLabel')}</Text>
      <div className={styles.passwordRow}>
        <ExternalTicketSystemPassword
          password={eventTicketSystem?.childPassword}
        />
        <AnchorButton href={eventTicketSystem?.url} openInNewTab>
          {t('externalTicketSystemEvent.continueButton')}
        </AnchorButton>
      </div>
      <Text>
        {t('externalTicketSystemEvent.participantsPerInviteText', {
          participantsPerInvite: t(
            `event.participantsPerInviteEnum.${data.event.participantsPerInvite}`
          ),
        })}
      </Text>
    </EventPage>
  );
};

export default ExternalTicketSystemEventIsEnrolled;
