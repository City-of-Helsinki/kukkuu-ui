import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styles from './notFound.module.scss';
import Container from '../layout/Container';
import Icon from '../../../common/components/icon/Icon';
import useGetPathname from '../../../common/route/utils/useGetPathname';
import { publicSvgIconPaths } from '../../../public_files';

const NotFound: FunctionComponent = () => {
  const { t } = useTranslation();
  const getPathname = useGetPathname();

  return (
    <Container>
      <div className={styles.notFound}>
        <h2>404</h2>
        <Icon src={publicSvgIconPaths['adultFace']} className={styles.icon} />
        <p>{t('notFound.text')}</p>

        <Link className={styles.returnLink} to={getPathname('/')}>
          {t('notFound.return.text')}
        </Link>
      </div>
    </Container>
  );
};

export default NotFound;
