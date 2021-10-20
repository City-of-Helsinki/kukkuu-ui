import { useTranslation } from 'react-i18next';

import { Partner } from './types/partner';
import Icon from '../../../common/components/icon/Icon';
import styles from './partnerLogoList.module.scss';
import { getCurrentLanguage } from '../../../common/translation/TranslationUtils';

type Props = {
  size: 'big' | 'small';
  partners: Partner[];
};

const Partners = (props: Props) => {
  const { i18n, t } = useTranslation();
  const currentLocale = getCurrentLanguage(i18n);
  const partners = props.partners;
  return (
    <div className={styles[props.size]}>
      {partners.map((partner: Partner, index: number) => {
        const icon =
          partner.altLangIcons && partner.altLangIcons[currentLocale]
            ? partner.altLangIcons[currentLocale]
            : partner.icon;
        const href = partner.url[currentLocale]
          ? partner.url[currentLocale]
          : partner.url.fi;

        return (
          <a key={index} href={href} className={styles.container}>
            <Icon
              className={styles.icon}
              src={icon}
              alt={t(`home.partners.partner.${partner.name}`)}
            />
          </a>
        );
      })}
    </div>
  );
};

export default Partners;
