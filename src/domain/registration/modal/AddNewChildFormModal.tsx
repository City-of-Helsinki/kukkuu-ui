import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { primaryChildFormDataSelector } from '../state/RegistrationSelectors';
import { Child } from '../../child/types/ChildTypes';
import ChildFormModal from '../../child/modal/ChildFormModal';
import { getChildFormModalValues } from '../../child/ChildUtils';

const AddNewChildFormModal: React.FunctionComponent<{
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  addChild: (payload: Child) => void;
}> = ({ isOpen, setIsOpen, addChild }) => {
  const primaryChildData = useSelector(primaryChildFormDataSelector);
  const { t } = useTranslation();
  const initialFormData = getChildFormModalValues(primaryChildData);

  const onSubmit = (payload: Child) => {
    addChild(payload);
    setIsOpen(false);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  return (
    <ChildFormModal
      initialValues={initialFormData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      label={t('child.form.modal.add.label')}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
};

export default AddNewChildFormModal;
