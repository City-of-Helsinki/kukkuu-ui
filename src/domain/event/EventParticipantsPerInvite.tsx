import { useTranslation } from 'react-i18next';

import Icon from '../../common/components/icon/Icon';
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
      <Icon
        src={getParticipantsIcon(participantsPerInvite)}
        alt={t('event.register.participants')}
        className={styles.icon}
        aria-hidden="true"
      />
      {t(`event.participantsPerInviteEnum.${participantsPerInvite}`)}
    </div>
  );
}

export default EventParticipantsPerInvite;
