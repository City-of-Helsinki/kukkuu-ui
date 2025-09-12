import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import styles from './ApplicationError.module.scss';
import Container from '../layout/Container';
import Icon from '../../../common/components/icon/Icon';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import { publicSvgIconPaths } from '../../../public_files';

const ApplicationError: FunctionComponent = () => {
  const { t } = useTranslation();
  const getPathname = useGetPathname();

  return (
    <Container>
      <div className={styles.applicationError}>
        <h2>{t('applicationError.title')}</h2>
        <Icon src={publicSvgIconPaths['adultFace']} className={styles.icon} />
        <p>{t('applicationError.text')}</p>

        <Link className={styles.returnLink} to={getPathname('/')}>
          {t('applicationError.return.text')}
        </Link>
      </div>
    </Container>
  );
};

export default ApplicationError;
