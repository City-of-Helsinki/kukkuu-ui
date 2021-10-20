import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Icon from '../../../../common/components/icon/Icon';
import backIcon from '../../../../assets/icons/svg/arrowLeft.svg';
import styles from './heroLayout.module.scss';

type Props = {
  children?: ReactElement | Array<ReactElement | false>;
  backTo?: string;
};

const PageContentWithHero = ({ children, backTo }: Props) => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.heroBackground}></div>
      <main className={styles.main}>
        <div className={styles.backButtonInnerWrapper}>
          {backTo && (
            <Link
              aria-label={t('common.backButton.label')}
              className={styles.backButton}
              to={backTo}
            >
              <Icon src={backIcon} className={styles.backButtonIcon} />
            </Link>
          )}
        </div>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};

export default PageContentWithHero;
