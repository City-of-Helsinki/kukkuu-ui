import { useTranslation } from 'react-i18next';

import styles from './homePartners.module.scss';
import Partners from './PartnerLogoList';
import { mainPartnerList, partnerList } from './constants/PartnersConstants';

const HomePartners = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.wrapper}>
      <div className={styles.innerwrapper}>
        <h2>{t('home.partners.heading.text')}</h2>
        <div className={styles.partners}>
          <Partners size="big" partners={mainPartnerList} />
          <Partners size="small" partners={partnerList} />
        </div>
      </div>
    </section>
  );
};

export default HomePartners;
