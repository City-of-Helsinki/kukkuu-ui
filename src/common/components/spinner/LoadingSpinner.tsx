import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './loadingSpinner.module.scss';

const LoadingSpinner: FunctionComponent<{ isLoading: boolean }> = ({
  isLoading,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {isLoading ? (
        <div className={styles.spinnerWrapper} aria-label={t('common.loading')}>
          <div className={styles.spinner} />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default LoadingSpinner;
