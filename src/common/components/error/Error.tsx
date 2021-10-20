import styles from './error.module.scss';
import PageWrapper from '../../../domain/app/layout/PageWrapper';

type ErrorProps = {
  message: string;
};

const ErrorMessage = ({ message }: ErrorProps) => {
  return (
    <PageWrapper>
      <div className={styles.error}>{message}</div>
    </PageWrapper>
  );
};

export default ErrorMessage;
