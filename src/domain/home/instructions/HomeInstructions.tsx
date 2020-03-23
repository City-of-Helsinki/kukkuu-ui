import * as React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './homeInstructions.module.scss';
import homeKidIcon from '../../../assets/icons/svg/homeKid.svg';
import homeTicketIcon from '../../../assets/icons/svg/homeTicket.svg';
import homeTheaterIcon from '../../../assets/icons/svg/homeTheater.svg';
import Icon from '../../../common/components/icon/Icon';

const HomeInstructions: React.FunctionComponent = (props) => {
  const { t } = useTranslation();
  return (
    <section className={styles.wrapper}>
      <div className={styles.instructions}>
        <h2>{t('home.instructions.heading.text')}</h2>
        <div className={styles.iconContainer}>
          <div className={styles.iconBox}>
            <Icon src={homeKidIcon} className={styles.icon} />
            <p>{t('home.instructions.icon.kid.text')}</p>
          </div>
          <div className={styles.iconBox}>
            <Icon src={homeTicketIcon} className={styles.icon} />
            <p>{t('home.instructions.icon.ticket.text')}</p>
          </div>
          <div className={styles.iconBox}>
            <Icon src={homeTheaterIcon} className={styles.icon} />
            <p>{t('home.instructions.icon.theater.text')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeInstructions;
