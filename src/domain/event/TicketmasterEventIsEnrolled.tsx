import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import styles from './ticketmasterEventIsEnrolled.module.scss';
import { ticketmasterEventQuery } from './queries/ticketmasterEventQuery';
import {
  ticketmasterEventQuery as TicketmasterEventQueryType,
  // eslint-disable-next-line max-len
  ticketmasterEventQuery_event_ticketSystem_TicketmasterEventTicketSystem as EventTicketSystem,
} from '../api/generatedTypes/ticketmasterEventQuery';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import Paragraph from '../../common/components/paragraph/Paragraph';
import EventPage from './EventPage';
import ErrorMessage from '../../common/components/error/Error';
import { useChildRouteGoBackTo } from '../profile/route/ProfileRoute';
import AnchorButton from '../../common/components/button/AnchorButton';
import TicketmasterPassword from './TicketmasterPassword';
import Text from '../../common/components/text/Text';

const TicketmasterEventIsEnrolled = () => {
  const { t } = useTranslation();
  const goBackTo = useChildRouteGoBackTo();
  const params = useParams<{ childId: string; eventId: string }>();
  const { loading, error, data } = useQuery<TicketmasterEventQueryType>(
    ticketmasterEventQuery,
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
      <Text>{t('ticketmasterEvent.description')}</Text>
      <Text>{t('ticketmasterEvent.passwordLabel')}</Text>
      <div className={styles.passwordRow}>
        <TicketmasterPassword password={eventTicketSystem?.childPassword} />
        <AnchorButton href={eventTicketSystem?.url} openInNewTab>
          {t('ticketmasterEvent.continueButton')}
        </AnchorButton>
      </div>
      <Text>
        {t('ticketmasterEvent.participantsPerInviteText', {
          participantsPerInvite: t(
            `event.participantsPerInviteEnum.${data.event.participantsPerInvite}`
          ),
        })}
      </Text>
    </EventPage>
  );
};

export default TicketmasterEventIsEnrolled;
