import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import copy from 'copy-to-clipboard';
import { IconCheck } from 'hds-react';

import styles from './ticketmasterPassword.module.scss';
import useAriaLive from '../../common/AriaLive/useAriaLive';

const CopyStates = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  error: 'ERROR',
} as const;

type CopyState = typeof CopyStates[keyof typeof CopyStates];

type Props = {
  password: string | null;
};

const TicketmasterPassword = ({ password }: Props) => {
  const { t } = useTranslation();
  const [copyStatus, setCopyStatus] = useState<CopyState>(CopyStates.initial);
  const { sendMessage } = useAriaLive();

  const handlePasswordCopy = () => {
    if (password) {
      const success = copy(password);
      // If copying was successful, true is returned. Otherwise the
      // copy-to-clipboard package will render a modal which advises the user
      // to copy by other means.
      if (success) {
        sendMessage(t('eventOccurrenceRedirectPage.passwordCopySuccess'));
        setCopyStatus(CopyStates.success);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.password}>{password}</div>
      <div className={styles.copyButtonWrapper}>
        <button
          type="button"
          onClick={handlePasswordCopy}
          className={styles.copyButton}
        >
          {t('eventOccurrenceRedirectPage.copyPassword')}
        </button>
        {copyStatus === CopyStates.success && (
          <div className={styles.successWrapper}>
            <IconCheck className={styles.successCheckMark} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketmasterPassword;
