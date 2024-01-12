import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconArrowLeft } from 'hds-react';

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
              <IconArrowLeft className={styles.backButtonIcon} />
            </Link>
          )}
        </div>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};

export default PageContentWithHero;
