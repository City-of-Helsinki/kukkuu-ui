import { FunctionComponent } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import Icon from '../../../common/components/icon/Icon';
import envelopeWithStars from '../../../assets/icons/svg/envelopeWithStars.svg';
import styles from './profileNoEvent.module.scss';

const ProfileNoEvent: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.noEventWrapper}>
      <h2>{t('profile.noupcomingevents.hero.heading')}</h2>
      <div className={styles.noEvent}>
        <Icon src={envelopeWithStars} className={styles.envelopIcon} />
        <p>
          <Trans i18nKey="multiline">
            {t('profile.noupcomingevents.text')}
          </Trans>
        </p>
      </div>
    </div>
  );
};

export default ProfileNoEvent;
