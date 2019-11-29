import * as React from 'react';
import { ArrayHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import styles from './childFormField.module.scss';
import { formatTime, newMoment } from '../../../../common/time/utils';
import { DEFAULT_DATE_FORMAT } from '../../../../common/time/TimeConstants';
import EnhancedInputField from '../../../../common/components/form/fields/input/EnhancedInputField';
import InputField from '../../../../common/components/form/fields/input/InputField';
import SelectField from '../../../../common/components/form/fields/select/SelectField';
import { Child } from '../../../child/types/ChildTypes';
import { getTranslatedRelationshipOptions } from '../../../child/ChildUtils';
import Icon from '../../../../common/components/icon/Icon';
import happyChildIcon from '../../../../assets/icons/svg/happyChild.svg';
import deleteIcon from '../../../../assets/icons/svg/delete.svg';
import Button from '../../../../common/components/button/Button';
import { deleteChildFromFormValues } from '../../state/RegistrationActions';

interface ChildFormFieldProps {
  child: Child;
  childIndex: number;
  arrayHelpers: ArrayHelpers;
}

const ChildFormField: React.FunctionComponent<ChildFormFieldProps> = ({
  child,
  childIndex,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <div className={styles.childField} key={childIndex}>
      <div className={styles.childInfo}>
        <div className={styles.heading}>
          <Icon
            src={happyChildIcon}
            className={styles.childImage}
            alt="Oh lord a happy child again"
          />
          <h2>{t('registration.form.child.info.heading')}</h2>
          {childIndex !== 0 && (
            <Button
              onClick={() => dispatch(deleteChildFromFormValues(childIndex))}
            >
              {t('child.form.modal.delete.label')}
              <Icon src={deleteIcon} alt="Delete child icon" />
            </Button>
          )}
        </div>
        <div className={styles.childFixedInfo}>
          <div className={styles.childBirthdate}>
            <label>{t('registration.form.child.birthdate.input.label')}</label>
            <p>{formatTime(newMoment(child.birthdate), DEFAULT_DATE_FORMAT)}</p>
          </div>

          <div className={styles.childHomeCity}>
            <label>{t('registration.form.child.homeCity.input.label')}</label>
            <p>{child.homeCity}</p>
          </div>
        </div>

        <div className={styles.childName}>
          <EnhancedInputField
            name={`children[${childIndex}].firstName`}
            label={t('registration.form.child.firstName.input.label')}
            autoComplete="new-password"
            component={InputField}
            placeholder={t(
              'registration.form.child.firstName.input.placeholder'
            )}
          />
          <EnhancedInputField
            name={`children[${childIndex}].lastName`}
            autoComplete="new-password"
            label={t('registration.form.child.lastName.input.label')}
            component={InputField}
            placeholder={t(
              'registration.form.child.lastName.input.placeholder'
            )}
          />
        </div>

        <EnhancedInputField
          name={`children[${childIndex}].postalCode`}
          type="number"
          label={t('registration.form.child.postalCode.input.label')}
          component={InputField}
          placeholder={t(
            'registration.form.child.postalCode.input.placeholder'
          )}
        />

        <EnhancedInputField
          name={`children[${childIndex}].relationship`}
          label={t('registration.form.child.relationship.input.label')}
          component={SelectField}
          id="registration.form.child.relationship.select"
          options={getTranslatedRelationshipOptions(t)}
          placeholder={t(
            'registration.form.child.relationship.input.placeholder'
          )}
        />
      </div>
    </div>
  );
};

export default ChildFormField;
