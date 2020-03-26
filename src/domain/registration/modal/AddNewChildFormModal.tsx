import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { primaryChildFormDataSelector } from '../state/RegistrationSelectors';
import { Child } from '../../child/types/ChildTypes';
import ChildFormModal from '../../child/modal/ChildFormModal';
import { getChildFormModalValues } from '../../child/ChildUtils';
import { isChildEligible } from '../notEligible/NotEligibleUtils';
import ChildAlertNonEligibleModal from '../../child/modal/alert/nonEligible/ChildAlertNonEligibleModal';

const AddNewChildFormModal: React.FunctionComponent<{
  setIsOpen: (value: boolean) => void;
  addChild: (payload: Child) => void;
}> = ({ setIsOpen, addChild }) => {
  const primaryChildData = useSelector(primaryChildFormDataSelector);
  const { t } = useTranslation();
  const initialFormData = getChildFormModalValues(primaryChildData);

  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isNonEligibleAlertOpen, toggleNonEligiblePrompt] = useState(false);

  const onFormModalToggle = (isOpen: boolean) => {
    if (isOpen === false) {
      setIsFormOpen(false);
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

    addChild(payload);
    setIsOpen(false);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  return isFormOpen ? (
    <ChildFormModal
      initialValues={initialFormData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      label={t('child.form.modal.add.label')}
      isOpen={isFormOpen}
      setIsOpen={onFormModalToggle}
    />
  ) : isNonEligibleAlertOpen ? (
    <ChildAlertNonEligibleModal setIsOpen={onNonEligibleAlertToggle} />
  ) : null;
};

export default AddNewChildFormModal;
