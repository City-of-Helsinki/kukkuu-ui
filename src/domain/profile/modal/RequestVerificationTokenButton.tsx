import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import styles from './editProfileModal.module.scss';
import { type RequestEmailUpdateTokenMutation } from '../../api/generatedTypes/graphql';
import Button from '../../../common/components/button/Button';
import requestEmailUpdateTokenMutation from '../mutations/requestEmailUpdateTokenMutation';
import useCoolDown from './useCoolDown';

type RequestVerificationTokenButtonProps = {
  email: string;
  disabled?: boolean;
};

export default function RequestVerificationTokenButton({
  email,
  disabled = false,
}: RequestVerificationTokenButtonProps) {
  const { t } = useTranslation();
  const [requestUpdateEmailVerificationToken, { loading }] =
    useMutation<RequestEmailUpdateTokenMutation>(
      requestEmailUpdateTokenMutation
    );

  const { seconds: coolDownSeconds, reset: resetCoolDown } = useCoolDown(
    60,
    false
  );

  const isDisabled = Boolean(disabled || loading || coolDownSeconds);

  const handleOnClick = async () => {
    try {
      await requestUpdateEmailVerificationToken({
        variables: {
          input: {
            email,
          },
        },
      });
      resetCoolDown();
      toast.success(
        t(
          'registration.form.guardian.email.verificationToken.request.successful'
        )
      );
    } catch (error) {
      toast.error(
        t('registration.form.guardian.email.verificationToken.request.error')
      );
      Sentry.captureException(error);
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleOnClick}
      className={styles.requestVerificationTokenButton}
      disabled={isDisabled}
    >
      {`${t(
        'registration.form.guardian.email.verificationToken.request.button'
      )}${coolDownSeconds ? ` (${coolDownSeconds})` : ''}`}
    </Button>
  );
}
