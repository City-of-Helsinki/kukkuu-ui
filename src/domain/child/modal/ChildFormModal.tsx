import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../../../common/components/modal/Modal';
import { Child } from '../types/ChildInputTypes';
import ChildForm from '../form/ChildForm';
import NavigationConfirm from '../../../common/components/confirm/NavigationConfirm';

interface ChildFormModalProps {
  initialValues: Child;
  label: string;
  onSubmit: (payload: Child) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  formType?: CHILD_FORM_TYPES;
}

export enum CHILD_FORM_TYPES {
  ADD = 'ADD',
  EDIT = 'EDIT',
}

const ChildFormModal: FunctionComponent<ChildFormModalProps> = ({
  initialValues,
  label,
  onSubmit,
  onCancel,
  onDelete,
  isOpen,
  setIsOpen,
  formType = CHILD_FORM_TYPES.ADD,
}) => {
  const { t } = useTranslation();
  const [isFilling, setFormIsFilling] = useState(false);

  return (
    <div>
      {isOpen && (
        // FIXME: Edit data -> Close modal -> Refresh
        <NavigationConfirm
          warningMessage={t('common.form.leave.warning.text')}
          isHalfFilling={isFilling}
        />
      )}
      <Modal
        isOpen={isOpen}
        label={label}
        toggleModal={(value: boolean) => {
          setIsOpen(value);
        }}
        setFormIsFilling={setFormIsFilling}
      >
        <ChildForm
          setFormIsFilling={setFormIsFilling}
          initialValues={initialValues}
          onSubmit={onSubmit}
          onCancel={onCancel}
          formType={formType}
          onDelete={onDelete}
        />
      </Modal>
    </div>
  );
};

export default ChildFormModal;
