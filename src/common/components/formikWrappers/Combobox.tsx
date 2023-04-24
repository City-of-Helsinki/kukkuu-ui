/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Combobox as HDSCombobox,
  ComboboxProps as HDSDropdownProps,
} from 'hds-react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { Option } from './types';
import styles from './formikInputs.module.scss';

type DropdownProps = Omit<
  HDSDropdownProps<Option>,
  'onChange' | 'value' | 'options' | 'defaultValue'
> & {
  onChange?: (values: string[]) => void;
  value?: string[];
  options: Option[];
};

export type ComboboxProps = Omit<DropdownProps, 'toggleButtonAriaLabel'> & {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  label: any;
  toggleButtonAriaLabel?: string;
};

function Combobox({
  name,
  onChange,
  options,
  value: userValue,
  ...rest
}: ComboboxProps) {
  const { t } = useTranslation();
  const [{ value = [], ...field }, meta, helpers] = useField<string[]>(name);

  const handleChange = (selectedItems: Option[]) => {
    const nextValues = selectedItems.map((item) => item.value);

    if (onChange) {
      onChange(nextValues);
    } else {
      helpers.setValue(nextValues);
    }
  };

  const handleBlur = () => {
    helpers.setTouched(true);
  };

  const usedValue = userValue || value;
  const valuesAsOptions = usedValue
    .map((value) => options.find((option) => option.value === value))
    .filter((option): option is Option => Boolean(option));

  return (
    <HDSCombobox<Option>
      {...field}
      className={styles.formField}
      error={meta.touched && Boolean(meta.error) && t(meta.error || '')}
      invalid={meta.touched && Boolean(meta.error)}
      onBlur={handleBlur}
      onChange={handleChange}
      value={valuesAsOptions}
      options={options}
      clearButtonAriaLabel={t('combobox.clearButtonAriaLabel')}
      selectedItemRemoveButtonAriaLabel={t('combobox.selectedItemSrLabel')}
      selectedItemSrLabel={t('combobox.selectedItemRemoveButtonAriaLabel')}
      toggleButtonAriaLabel={t('combobox.toggleButtonAriaLabel')}
      {...rest}
      multiselect
    />
  );
}

export default Combobox;
