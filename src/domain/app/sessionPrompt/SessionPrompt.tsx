import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';

import styles from './sessionPrompt.module.scss';
import Modal from '../../../common/components/modal/Modal';
import { closeExpiredSessionPrompt } from '../state/ui/UIActions';
import Button from '../../../common/components/button/Button';
import { logoutTunnistamo } from '../../auth/authenticate';
import { resetBackendAuthentication } from '../../auth/state/BackendAuthenticationActions';

const SessionPrompt: React.FunctionComponent<{ isOpen: boolean }> = ({
  isOpen = false,
}) => {
  const dispatch = useDispatch();

  const flushAuthenticationData = () => {
    dispatch(closeExpiredSessionPrompt());

    dispatch(resetBackendAuthentication());

    logoutTunnistamo();
  };
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Modal
        isOpen={isOpen}
        label={t('authentication.session.expired.label')}
        toggleModal={() => flushAuthenticationData()}
        showLabelIcon={false}
        className={styles.modal}
      >
        <div className={styles.sessionExpired}>
          <p>
            <Trans i18nKey="authentication.session.expired.message" />
          </p>
        </div>
        <div className={styles.goBackButton}>
          <Button onClick={() => flushAuthenticationData()}>
            {t('authentication.session.expired.agree')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SessionPrompt;