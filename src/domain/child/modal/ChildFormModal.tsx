import * as React from 'react';
import { Formik, FieldArray, FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import Modal from '../../../common/components/modal/Modal';
import styles from './childFormModal.module.scss';
import BirthdateFormField from '../../home/form/partial/BirthdateFormField';
import EnhancedInputField from '../../../common/components/form/fields/input/EnhancedInputField';
import InputField from '../../../common/components/form/fields/input/InputField';
import Button from '../../../common/components/button/Button';
import SelectField from '../../../common/components/form/fields/select/SelectField';
import { Child } from '../types/ChildTypes';
import { getTranslatedRelationshipOptions } from '../ChildUtils';
import NavigationPropmt from '../../../common/components/prompt/NavigationPrompt';
import {
  validatePostalCode,
  validateDate,
} from '../../../common/components/form/validationUtils';
import { formatTime, newMoment } from '../../../common/time/utils';
import { BACKEND_DATE_FORMAT } from '../../../common/time/TimeConstants';
import { isChildEligible } from '../../registration/notEligible/NotEligibleUtils';
import ChildFormModalNonEligible from './prompt/nonEligible/ChildFormModalNonEligible';
import ChildFormModalDeletePrompt from './prompt/delete/ChildFormModalDeletePrompt';
export interface ChildFormModalValues extends Omit<Child, 'birthdate'> {
  birthdate: {
    day: number | string;
    month: number | string;
    year: number | string;
  };
  childBirthdate?: string;
}
interface ChildFormModalProps {
  initialValues: ChildFormModalValues;
  label: string;
  onSubmit: (payload: Child) => void;
  onDelete?: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  formType?: CHILD_FORM_TYPES;
}

export enum CHILD_FORM_TYPES {
  ADD = 'ADD',
  EDIT = 'EDIT',
}

const ChildFormModal: React.FunctionComponent<ChildFormModalProps> = ({
  initialValues,
  label,
  onSubmit,
  onDelete,
  isOpen,
  setIsOpen,
  formType = CHILD_FORM_TYPES.ADD,
}) => {
  const { t } = useTranslation();
  const [isFilling, setFormIsFilling] = React.useState(false);
  const [nonEligible, toggleNonEligiblePrompt] = React.useState(false);
  const [isDeleteChildPromptOpen, toggleDeleteChildPrompt] = React.useState(
    false
  );

  const isEditForm = formType === CHILD_FORM_TYPES.EDIT;

  // Child who already have relationship can not go back to have empty relationship anymore
  // Why ? Ask backend guys.
  const isChildHavingRelationship = !!initialValues.relationship?.type;

  const getModalLabel = () => {
    if (nonEligible || isDeleteChildPromptOpen) return '';
    return label;
  };

  const renderModalContent = () => {
    if (nonEligible) {
      return <ChildFormModalNonEligible setIsOpen={setIsOpen} />;
    }

    if (onDelete && isDeleteChildPromptOpen) {
      return (
        <ChildFormModalDeletePrompt
          deleteChild={onDelete}
          setIsOpen={setIsOpen}
        />
      );
    }

    return (
      <Formik
        validate={(values: ChildFormModalValues) => {
          const {
            birthdate: { day, month, year },
          } = values;
          if (!isFilling) {
            setFormIsFilling(true);
          }

          const errors: FormikErrors<ChildFormModalValues> = {};

          if (day && month && year) {
            errors.childBirthdate = validateDate(`${day}.${month}.${year}`);

            if (!errors.childBirthdate) {
              // Delete the property manually so form will be valid when this is undefined.
              delete errors.childBirthdate;
            }
          }
          return errors;
        }}
        initialValues={initialValues}
        onSubmit={(values: ChildFormModalValues) => {
          setFormIsFilling(false);
          const child: Child = Object.assign({}, values, {
            birthdate: formatTime(
              newMoment(
                `${values.birthdate.year}-${values.birthdate.month}-${values.birthdate.day}`,
                BACKEND_DATE_FORMAT
              )
            ),
          });

          const isEligible = isChildEligible(child, isEditForm);
          if (isEligible) {
            onSubmit(child);
          } else {
            toggleNonEligiblePrompt(true);
          }
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <form onSubmit={handleSubmit} id="childModalForm">
            <FieldArray
              name="birthdate"
              render={props => <BirthdateFormField {...props} />}
            />

            <div className={styles.childInfo}>
              <EnhancedInputField
                className={styles.childHomeCity}
                id="homeCity"
                name="homeCity"
                label={t('homePage.preliminaryForm.childHomeCity.input.label')}
                required={true}
                component={InputField}
                placeholder={t(
                  'homePage.preliminaryForm.childHomeCity.input.placeholder'
                )}
              />

              <EnhancedInputField
                className={styles.childPostalCode}
                required={true}
                id="postalCode"
                name="postalCode"
                validate={validatePostalCode}
                label={t('registration.form.child.postalCode.input.label')}
                component={InputField}
                placeholder={t(
                  'registration.form.child.postalCode.input.placeholder'
                )}
              />
            </div>

            <div className={styles.childName}>
              <EnhancedInputField
                id="firstName"
                name="firstName"
                label={t('registration.form.child.firstName.input.label')}
                component={InputField}
                autoComplete="new-password"
                placeholder={t(
                  'registration.form.child.firstName.input.placeholder'
                )}
              />
              <EnhancedInputField
                id="lastName"
                name="lastName"
                autoComplete="new-password"
                label={t('registration.form.child.lastName.input.label')}
                component={InputField}
                placeholder={t(
                  'registration.form.child.lastName.input.placeholder'
                )}
              />
            </div>

            <EnhancedInputField
              id="relationship.type"
              name="relationship.type"
              label={t('registration.form.child.relationship.input.label')}
              autoSelect={isChildHavingRelationship}
              component={SelectField}
              options={getTranslatedRelationshipOptions(t)}
              placeholder={t(
                'registration.form.child.relationship.input.placeholder'
              )}
            />

            <div
              className={classnames(
                styles.buttonGroup,
                isEditForm ? styles.editChildButtons : styles.addChildButtons
              )}
            >
              {isEditForm && (
                <Button
                  className={styles.cancelButton}
                  onClick={() => setIsOpen(false)}
                >
                  {t('common.modal.cancel.text')}
                </Button>
              )}
              <Button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {t(
                  isEditForm
                    ? 'common.modal.save.text'
                    : 'child.form.modal.add.label'
                )}
              </Button>
            </div>

            {isEditForm && (
              <Button
                className={styles.deleteChild}
                ariaLabel={t('profile.child.detail.delete.text')}
                onClick={() => toggleDeleteChildPrompt(true)}
              >
                {t('profile.child.detail.delete.text')}
              </Button>
            )}
          </form>
        )}
      </Formik>
    );
  };

  return (
    <div className={styles.childFormModalWrapper}>
      {isOpen && (
        <NavigationPropmt
          warningMessage={t('common.form.leave.warning.text')}
          isHalfFilling={isFilling}
        />
      )}
      <Modal
        isOpen={isOpen}
        label={getModalLabel()}
        toggleModal={(value: boolean) => {
          // Reset prompt state cause hook dont auto-reset
          toggleNonEligiblePrompt(false);
          toggleDeleteChildPrompt(false);

          setIsOpen(value);
        }}
        showLabelIcon={!nonEligible && !isDeleteChildPromptOpen}
        showHeading={!isDeleteChildPromptOpen}
        setFormIsFilling={setFormIsFilling}
        className={isDeleteChildPromptOpen ? styles.modal : ''}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default ChildFormModal;
