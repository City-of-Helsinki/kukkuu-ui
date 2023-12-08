import { useTranslation } from 'react-i18next';

import styles from './moreInfoLinkList.module.scss';
import { MoreInfoLink } from './types/moreInfo';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';

type MoreInfoLinkListProps = {
  links: MoreInfoLink[];
};

const MoreInfoLinkList = ({ links }: MoreInfoLinkListProps) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = getCurrentLanguage(i18n);
  console.log({ currentLanguage });
  return (
    <div className={styles.link}>
      {links.map((link, index: number) => {
        const languageName = t(`home.moreInfo.links.${link.langCode}`);
        return (
          <a href={link.url} key={index}>
            <span lang={link.langCode}>{link.langName}</span>
            <span>&thinsp;</span>
            <span lang={currentLanguage} className={styles.localizedLanguage}>
              ({languageName})
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default MoreInfoLinkList;
