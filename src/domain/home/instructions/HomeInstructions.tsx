import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IconTicket } from 'hds-react';

import styles from './homeInstructions.module.scss';
import Icon from '../../../common/components/icon/Icon';

const HomeInstructions: React.FunctionComponent = (props) => {
  const { t } = useTranslation();
  return (
    <section className={styles.wrapper}>
      <div className={styles.instructions}>
        <h2>{t('home.instructions.heading.text')}</h2>
        <div className={styles.iconContainer}>
          <div className={styles.iconBox}>
            <Icon src={'/icons/svg/homeKid.svg'} className={styles.icon} />
            <p>{t('home.instructions.icon.kid.text')}</p>
          </div>
          <div className={styles.iconBox}>
            <IconTicket className={styles.icon} />
            <p>{t('home.instructions.icon.ticket.text')}</p>
          </div>
          <div className={styles.iconBox}>
            <Icon src={'/icons/svg/homeTheater.svg'} className={styles.icon} />
            <p>{t('home.instructions.icon.theater.text')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeInstructions;
