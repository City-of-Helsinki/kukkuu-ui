import React, { useMemo } from 'react';

import Combobox, {
  ComboboxProps,
} from '../../common/components/formikWrappers/Combobox';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import useLanguages from './hooks/useLanguages';

type Props = Omit<ComboboxProps, 'options'>;

const LanguagesCombobox = (props: Props) => {
  const { languages, loading: isLoadingLanguages } = useLanguages();

  const languageOptions = useMemo(
    () =>
      languages.items.map((language) => ({
        label: language.name || '',
        value: language.id || '',
      })),
    [languages.items]
  );

  if (isLoadingLanguages) {
    return <LoadingSpinner isLoading={true} />;
  }

  return <Combobox {...props} options={languageOptions} />;
};

export default LanguagesCombobox;
