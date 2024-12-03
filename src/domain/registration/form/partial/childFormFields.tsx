import * as React from 'react';
import { ArrayHelpers, FormikState, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { IconCrossCircle } from 'hds-react';

import styles from './childFormFields.module.scss';
import { Child } from '../../../child/types/ChildInputTypes';
import { getTranslatedRelationshipOptions } from '../../../child/ChildUtils';
import Icon from '../../../../common/components/icon/Icon';
import FormikDropdown from '../../../../common/components/formikWrappers/FormikDropdown';
import { RegistrationFormValues } from '../../types/RegistrationTypes';
import Button from '../../../../common/components/button/Button';
import FormikTextInput from '../../../../common/components/formikWrappers/FormikTextInput';
import MandatoryFieldLegend from '../../../../common/components/mandatoryFieldLegend/MandatoryFieldLegend';
import { publicSvgIconPaths } from '../../../../public_files';

type ChildFormFieldProps = {
  child: Child;
  childIndex: number;
  arrayHelpers: ArrayHelpers;
} & Pick<FormikState<RegistrationFormValues>, 'errors' | 'touched'> &
  Pick<
    FormikHelpers<RegistrationFormValues>,
    'setFieldTouched' | 'setFieldValue'
  >;

const ChildFormFields: React.FunctionComponent<ChildFormFieldProps> = ({
  child,
  childIndex,
  arrayHelpers,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.childFields} key={childIndex}>
      <div className={styles.childInfo}>
        <div className={styles.heading}>
          <Icon
            src={publicSvgIconPaths['childFaceHappy']}
            className={styles.childImage}
          />
          <h2>{t('registration.form.child.info.heading')}</h2>

          {/* Show mandatory field legend only in first child form */}
          {childIndex === 0 && <MandatoryFieldLegend position="right" />}

          {/* Allow to remove only non-first children */}
          {childIndex !== 0 && (
            <Button
              variant="supplementary"
              iconRight={<IconCrossCircle />}
              aria-label={t('child.form.modal.delete.label')}
              onClick={() => arrayHelpers.remove(childIndex)}
            >
              {t('child.form.modal.delete.label')}
            </Button>
          )}
        </div>
        <div className={styles.childFixedInfo}>
          <div className={styles.childBirthyear}>
            <label>{t('registration.form.child.birthyear.input.label')}</label>
            <p>{child.birthyear}</p>
          </div>

          <div className={styles.childHomeCity}>
            <label>{t('registration.form.child.homeCity.input.label')}</label>
            <p>{child.homeCity}</p>
          </div>
        </div>

        <div className={styles.childName}>
          <FormikTextInput
            id={`children[${childIndex}].name`}
            name={`children[${childIndex}].name`}
            label={t('registration.form.child.name.input.label')}
            autoComplete="new-password"
            placeholder={t('registration.form.child.name.input.placeholder')}
          />
        </div>

        <FormikTextInput
          id={`children[${childIndex}].postalCode`}
          name={`children[${childIndex}].postalCode`}
          label={t('registration.form.child.postalCode.input.label')}
          required={true}
          placeholder={t(
            'registration.form.child.postalCode.input.placeholder'
          )}
        />

        <FormikDropdown
          id={`children[${childIndex}].relationship.type`}
          name={`children[${childIndex}].relationship.type`}
          value={child.relationship?.type || undefined}
          label={t('registration.form.child.relationship.input.label')}
          required={true}
          options={getTranslatedRelationshipOptions(t)}
          placeholder={t('common.select.default.text')}
        />
      </div>
    </div>
  );
};

export default ChildFormFields;
