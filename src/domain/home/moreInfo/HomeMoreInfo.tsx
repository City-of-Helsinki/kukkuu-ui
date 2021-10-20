import { useTranslation } from 'react-i18next';

import styles from './homeMoreInfo.module.scss';
import MoreInfoLinkList from './MoreInfoLinkList';
import { moreInfoLinks } from './constants/MoreInfoConstants';

const HomeMoreInfo = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.wrapper}>
      <div className={styles.innerwrapper}>
        <h2>{t('home.moreInfo.heading.text')}</h2>
        <p>{t('home.moreInfo.description.text')}</p>
        <MoreInfoLinkList links={moreInfoLinks} />
      </div>
    </section>
  );
};

export default HomeMoreInfo;
