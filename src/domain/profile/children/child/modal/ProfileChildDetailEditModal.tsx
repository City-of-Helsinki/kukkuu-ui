import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Child } from '../../../../child/types/ChildInputTypes';
import ChildFormModal from '../../../../child/modal/ChildFormModal';
import { ChildFormType } from '../../../../child/enums';
import {
  getChildFormModalValues,
  getSupportedChildData,
} from '../../../../child/ChildUtils';
import { normalizeProfileChild } from '../../../ProfileUtil';
import type { ChildDetailEditModalPayload } from '../types';
import ChildConfirmDeleteModal from '../../../../child/modal/confirm/delete/ChildConfirmDeleteModal';
import { isChildEligible } from '../../../../registration/notEligible/NotEligibleUtils';
import ChildAlertNonEligibleModal from '../../../../child/modal/alert/nonEligible/ChildAlertNonEligibleModal';
import { ChildByIdResponse } from '../../../../child/types/ChildByIdQueryTypes';
import { useProfileContext } from '../../../hooks/useProfileContext';

const ProfileChildDetailEditModal: FunctionComponent<{
  setIsOpen: (value: boolean) => void;
  editChild: (payload: ChildDetailEditModalPayload) => void;
  deleteChild: () => void;
  childBeingEdited: ChildByIdResponse;
}> = ({ setIsOpen, editChild, deleteChild, childBeingEdited }) => {
  const { t } = useTranslation();
  const normalizedChild = normalizeProfileChild(childBeingEdited);
  const initialFormData = getChildFormModalValues(normalizedChild);
  const { refetchProfile } = useProfileContext();
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isNonEligibleAlertOpen, toggleNonEligiblePrompt] = useState(false);

  const onFormModalToggle = (isOpen: boolean) => {
    if (isOpen === false) {
      setIsFormOpen(false);
      setIsOpen(false);
    }
  };

  const openDeleteConfirmModal = async () => {
    setIsFormOpen(false);
    setIsDeleteConfirmOpen(true);
    refetchProfile();
  };

  const onDeleteConfirmModalToggle = (isOpen: boolean) => {
    if (isOpen === false) {
      setIsOpen(false);
    }
  };

  const onNonEligibleAlertToggle = (isOpen: boolean) => {
    if (isOpen === false) {
      setIsOpen(false);
    }
  };

  const onSubmit = (payload: Child) => {
    const isEligible = isChildEligible(payload, true);
    if (!isEligible) {
      toggleNonEligiblePrompt(true);
      setIsFormOpen(false);
      return;
    }

    // Ensure that we're using the correct typing when we're updating and querying
    // children. updateChild_updateChild_child has a different set of fields compared to
    // childByIdQuery_child
    const supportedChildPayload: ChildDetailEditModalPayload =
      getSupportedChildData(payload, true);
    editChild(supportedChildPayload);
    setIsOpen(false);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  const onDelete = () => {
    deleteChild();
    setIsOpen(false);
  };

  return isFormOpen ? (
    <ChildFormModal
      initialValues={initialFormData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={openDeleteConfirmModal}
      label={t('child.form.modal.edit.label')}
      isOpen={isFormOpen}
      setIsOpen={onFormModalToggle}
      formType={ChildFormType.EDIT}
    />
  ) : isDeleteConfirmOpen ? (
    <ChildConfirmDeleteModal
      deleteChild={onDelete}
      setIsOpen={onDeleteConfirmModalToggle}
    />
  ) : isNonEligibleAlertOpen ? (
    <ChildAlertNonEligibleModal setIsOpen={onNonEligibleAlertToggle} />
  ) : null;
};

export default ProfileChildDetailEditModal;
