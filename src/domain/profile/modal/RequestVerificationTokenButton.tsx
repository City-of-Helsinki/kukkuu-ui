import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import styles from './editProfileModal.module.scss';
import { type RequestEmailUpdateTokenMutation } from '../../api/generatedTypes/graphql';
import Button from '../../../common/components/button/Button';
import requestEmailUpdateTokenMutation from '../mutations/requestEmailUpdateTokenMutation';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import useCoolDown from './useCoolDown';

export default function RequestVerificationTokenButton() {
  const { t } = useTranslation();
  const [requestUpdateEmailVerificationToken, { loading }] =
    useMutation<RequestEmailUpdateTokenMutation>(
      requestEmailUpdateTokenMutation
    );

  const { seconds: coolDownSeconds, reset: resetCoolDown } = useCoolDown(
    60,
    false
  );

  const isDisabled = Boolean(loading || coolDownSeconds);

  const handleOnClick = async () => {
    try {
      await requestUpdateEmailVerificationToken();
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
    <LoadingSpinner isLoading={loading}>
      <Button
        variant="supplementary"
        onClick={handleOnClick}
        className={styles.requestVerificationTokenButton}
        disabled={isDisabled}
      >
        {coolDownSeconds
          ? coolDownSeconds
          : t(
              'registration.form.guardian.email.verificationToken.request.button'
            )}
      </Button>
    </LoadingSpinner>
  );
}
