import { FunctionComponent } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { logoutTunnistamo } from '../../auth/authenticate';
import { flushAllState } from '../../auth/state/AuthenticationUtils';
import AlertModal from '../../../common/components/alert/AlertModal';

const SessionAlert: FunctionComponent<{ isOpen: boolean }> = ({
  isOpen = false,
}) => {
  const flushAuthenticationData = () => {
    // flush all state except user form data
    // This will also include close this alert modal
    flushAllState({ keepUserFormData: true });

    // Log out
    logoutTunnistamo();
  };
  const { t } = useTranslation();

  return (
    <AlertModal
      isOpen={isOpen}
      heading={t('authentication.session.expired.label')}
      ok={t('authentication.session.expired.agree')}
      onClose={flushAuthenticationData}
    >
      <p>
        <Trans i18nKey="authentication.session.expired.message" />
      </p>
    </AlertModal>
  );
};

export default SessionAlert;
