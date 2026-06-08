import { useMemo } from 'react';

import Combobox, {
  ComboboxProps,
} from '../../common/components/formikWrappers/Combobox';
import useLanguages from './hooks/useLanguages';

type Props = Omit<ComboboxProps, 'options'>;

const LanguagesCombobox = (props: Props) => {
  const { name, ...rest } = props;
  const { languages } = useLanguages();

  const languageOptions = useMemo(
    () =>
      languages.items.map((language) => ({
        label: language.name || '',
        value: language.id || '',
      })),
    [languages.items]
  );

  return (
    <Combobox
      {...rest}
      name={name}
      clearable={false}
      options={languageOptions}
    />
  );
};

export default LanguagesCombobox;
