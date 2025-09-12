import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import styles from './notEligible.module.scss';
import Icon from '../../../common/components/icon/Icon';
import PageWrapper from '../../app/layout/PageWrapper';
import Button from '../../../common/components/button/Button';
import { publicSvgIconPaths } from '../../../public_files';

const NotEligible: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <PageWrapper>
      <div>
        <div className={styles.notEligible}>
          <Icon
            className={styles.notEligibleFace}
            src={publicSvgIconPaths['adultFace']}
          />
          <p>{t('registration.notEligible.text')}</p>
          <Link
            to={t('registration.notEligible.otherOptionsLink')}
            target="_blank"
          >
            <Button className={styles.goBackButton}>
              {t('registration.notEligible.buttonText')}
            </Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NotEligible;
