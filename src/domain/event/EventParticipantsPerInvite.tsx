import React from 'react';
import { useTranslation } from 'react-i18next';

import personIcon from '../../assets/icons/svg/person.svg';
import Icon from '../../common/components/icon/Icon';
import { EventParticipantsPerInvite as EventParticipantsPerInviteEnum } from '../api/generatedTypes/globalTypes';
import styles from './eventParticipantsPerInvite.module.scss';

function getIcon(iconType: EventParticipantsPerInviteEnum) {
  switch (iconType) {
    case EventParticipantsPerInviteEnum.CHILD_AND_1_OR_2_GUARDIANS:
    case EventParticipantsPerInviteEnum.CHILD_AND_GUARDIAN:
    case EventParticipantsPerInviteEnum.FAMILY:
    default:
      return personIcon;
  }
}

type Props = {
  participantsPerInvite: EventParticipantsPerInviteEnum;
};

function EventParticipantsPerInvite({ participantsPerInvite }: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.participantsPerInvite}>
      <Icon
        src={getIcon(participantsPerInvite)}
        alt={t('event.register.participants')}
        className={styles.icon}
        aria-hidden="true"
      />
      {t(`event.participantsPerInviteEnum.${participantsPerInvite}`)}
    </div>
  );
}

export default EventParticipantsPerInvite;
