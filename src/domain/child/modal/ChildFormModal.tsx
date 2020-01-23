import * as React from 'react';
import { Formik, FieldArray, FormikErrors } from 'formik';
import { useTranslation } from 'react-i18next';

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
import Icon from '../../../common/components/icon/Icon';
import personIcon from '../../../assets/icons/svg/adultFace.svg';

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
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ChildFormModal: React.FunctionComponent<ChildFormModalProps> = ({
  initialValues,
  label,
  onSubmit,
  isOpen,
  setIsOpen,
}) => {
  const { t } = useTranslation();
  const [isFilling, setFormIsFilling] = React.useState(false);
  const [nonEligible, toggleNonEligible] = React.useState(false);
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
        label={nonEligible ? '' : label}
        toggleModal={(value: boolean) => {
          toggleNonEligible(false);
          setIsOpen(value);
        }}
        setFormIsFilling={setFormIsFilling}
      >
        {nonEligible ? (
          <div className={styles.notEligible}>
            <h3>{t('registration.notEligible.title')}</h3>
            <p>{t('registration.notEligible.text')}</p>
            <Icon
              className={styles.icon}
              src={personIcon}
              alt="not eligible icon"
            />
            <Button
              className={styles.goBackButton}
              onClick={() => setIsOpen(false)}
            >
              {t('child.form.modal.notEligible.return.text')}
            </Button>
          </div>
        ) : (
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

              const isEligible = isChildEligible(child);
              if (isEligible) {
                onSubmit(child);
              } else {
                toggleNonEligible(true);
              }
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <FieldArray
                  name="birthdate"
                  render={props => <BirthdateFormField {...props} />}
                />

                <div className={styles.childInfo}>
                  <EnhancedInputField
                    className={styles.childHomeCity}
                    id="homeCity"
                    name="homeCity"
                    label={t(
                      'homePage.preliminaryForm.childHomeCity.input.label'
                    )}
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
                  component={SelectField}
                  options={getTranslatedRelationshipOptions(t)}
                  placeholder={t(
                    'registration.form.child.relationship.input.placeholder'
                  )}
                />

                <Button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {t('child.form.modal.add.label')}
                </Button>
              </form>
            )}
          </Formik>
        )}
      </Modal>
    </div>
  );
};

export default ChildFormModal;
