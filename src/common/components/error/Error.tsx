import { Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';

import styles from './error.module.scss';
import PageWrapper from '../../../domain/app/layout/PageWrapper';

type ErrorProps = {
  message: string;
  title?: string;
};

const ErrorMessage = ({ message, title }: ErrorProps) => {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <div className={styles.error}>
        <Notification type="error" label={title || t('applicationError.title')}>
          {message}
        </Notification>
      </div>
    </PageWrapper>
  );
};

export default ErrorMessage;
