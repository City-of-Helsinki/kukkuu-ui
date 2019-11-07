import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { getCurrentLanguage } from '../../../../../common/translation/utils';
import styles from './languageDropdown.module.scss';
import Select from '../../../../../common/components/select/Select';
import { SUPPORT_LANGUAGES } from '../../../../../common/translation/TranslationConstants';
import { updateURLParam } from '../../../../../common/route/RouteUtils';

const LanguageDropdown: React.FunctionComponent = () => {
  const currentLanguage = getCurrentLanguage();

  const history = useHistory();
  const location = useLocation();

  const languageOptions = Object.values(SUPPORT_LANGUAGES).map(language => {
    return {
      value: language,
      label: language.toUpperCase(),
    };
  });
  return (
    <div className={styles.languageDropdown}>
      <Select
        options={languageOptions}
        value={currentLanguage}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          history.push(
            updateURLParam(location.pathname, currentLanguage, e.target.value)
          )
        }
        id="languageDropdownNavbar"
      />
    </div>
  );
};

export default LanguageDropdown;
