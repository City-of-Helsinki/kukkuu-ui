import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styles from './notFound.module.scss';
import Container from '../layout/Container';
import Icon from '../../../common/components/icon/Icon';
import adultFace from '../../../assets/icons/svg/adultFace.svg';

const NotFound: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <div className={styles.notFound}>
        <h2>404</h2>
        <Icon src={adultFace} className={styles.icon} />
        <p>{t('notFound.text')}</p>

        <Link className={styles.returnLink} to="/">
          {t('notFound.return.text')}
        </Link>
      </div>
    </Container>
  );
};

export default NotFound;
