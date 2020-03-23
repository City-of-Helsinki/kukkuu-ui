import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Partner } from './types/partner';
import Icon from '../../../common/components/icon/Icon';
import styles from './partnerLogoList.module.scss';

type Props = {
  size: 'big' | 'small';
  partners: Partner[];
};

const Partners: React.FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();

  const partners = props.partners;
  return (
    <div className={styles[props.size]}>
      {partners.map((partner: Partner, index: number) => (
        <Icon
          key={index}
          className={styles.icon}
          src={partner.icon}
          alt={t(`home.partners.partner.${partner.name}`)}
        />
      ))}
    </div>
  );
};

export default Partners;
