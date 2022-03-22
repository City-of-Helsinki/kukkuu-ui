import { useTranslation } from 'react-i18next';

import { EventParticipantsPerInvite as EventParticipantsPerInviteEnum } from '../api/generatedTypes/globalTypes';
import styles from './eventParticipantsPerInvite.module.scss';
import { getParticipantsIcon } from './EventUtils';

type Props = {
  participantsPerInvite: EventParticipantsPerInviteEnum;
};

function EventParticipantsPerInvite({ participantsPerInvite }: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.participantsPerInvite}>
      {getParticipantsIcon(participantsPerInvite)}
      {t(`event.participantsPerInviteEnum.${participantsPerInvite}`)}
    </div>
  );
}

export default EventParticipantsPerInvite;
