import { useTranslation } from 'react-i18next';

import styles from './moreInfoLinkList.module.scss';
import { MoreInfoLink } from './types/moreInfo';

type MoreInfoLinkListProps = {
  links: MoreInfoLink[];
};

const MoreInfoLinkList = ({ links }: MoreInfoLinkListProps) => {
  const { t } = useTranslation();
  return (
    <div className={styles.link}>
      {links.map((link, index: number) => {
        const languageName = t(`home.moreInfo.links.${link.langCode}`);
        return (
          <a
            href={link.url}
            lang={link.langCode}
            key={index}
            title={languageName}
          >
            {link.langName}
          </a>
        );
      })}
    </div>
  );
};

export default MoreInfoLinkList;
