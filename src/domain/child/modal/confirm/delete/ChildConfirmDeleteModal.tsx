import React, { FunctionComponent } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import ConfirmModal from '../../../../../common/components/confirm/ConfirmModal';

interface ChildFormModalDeletePromptProps {
  deleteChild: () => void;
  setIsOpen: (value: boolean) => void;
}

const ChildConfirmDeleteModal: FunctionComponent<ChildFormModalDeletePromptProps> = ({
  setIsOpen,
  deleteChild,
}) => {
  const { t } = useTranslation();

  const confirmDelete = (answer: boolean) => {
    if (answer === true) deleteChild();
  };

  return (
    <ConfirmModal
      isOpen={true}
      setIsOpen={setIsOpen}
      heading={t('profile.child.detail.delete.prompt.heading')}
      cancel={t('common.modal.cancel.text')}
      ok={t('profile.child.detail.delete.text')}
      answer={confirmDelete}
    >
      <p>
        <Trans i18nKey="multiline">
          {t('profile.child.detail.delete.prompt.text')}
        </Trans>
      </p>
    </ConfirmModal>
  );
};

export default ChildConfirmDeleteModal;
