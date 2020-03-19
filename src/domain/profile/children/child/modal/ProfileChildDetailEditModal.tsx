import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import omit from 'lodash/omit';

import { Child } from '../../../../child/types/ChildTypes';
import ChildFormModal, {
  CHILD_FORM_TYPES,
} from '../../../../child/modal/ChildFormModal';
import { getChildFormModalValues } from '../../../../child/ChildUtils';
import { normalizeProfileChild } from '../../../ProfileUtil';
import { ChildDetailEditModalPayload } from '../ProfileChildDetail';
import { childByIdQuery_child as ChildByIdResponse } from '../../../../api/generatedTypes/childByIdQuery';
import ChildConfirmDeleteModal from '../../../../child/modal/confirm/delete/ChildConfirmDeleteModal';

const ProfileChildDetailEditModal: FunctionComponent<{
  setIsOpen: (value: boolean) => void;
  editChild: (payload: ChildDetailEditModalPayload) => void;
  deleteChild: () => void;
  childBeingEdited: ChildByIdResponse;
}> = ({ setIsOpen, editChild, deleteChild, childBeingEdited }) => {
  const { t } = useTranslation();
  const normalizedChild = normalizeProfileChild(childBeingEdited);
  const initialFormData = getChildFormModalValues(normalizedChild);

  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const onFormModalToggle = (isOpen: boolean) => {
    if (isOpen === false) {
      setIsFormOpen(false);
      setIsOpen(false);
    }
  };

  const openDeleteConfirmModal = () => {
    setIsFormOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const onDeleteConfirmModalToggle = (isOpen: boolean) => {
    if (isOpen === false) {
      setIsOpen(false);
    }
  };

  const onSubmit = (payload: Child) => {
    // Ensure that we're using the correct typing when we're updating and querying
    // children. updateChild_updateChild_child has a different set of fields compared to
    // childByIdQuery_child
    const supportedChildPayload = omit(payload, [
      'homeCity',
      '__typename',
      'occurrences',
      'availableEvents',
      'enrolments',
      'pastEvents',
    ]);
    editChild(supportedChildPayload);
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
      onDelete={openDeleteConfirmModal}
      label={t('child.form.modal.edit.label')}
      isOpen={isFormOpen}
      setIsOpen={onFormModalToggle}
      formType={CHILD_FORM_TYPES.EDIT}
    />
  ) : isDeleteConfirmOpen ? (
    <ChildConfirmDeleteModal
      deleteChild={onDelete}
      setIsOpen={onDeleteConfirmModalToggle}
    />
  ) : null;
};

export default ProfileChildDetailEditModal;
