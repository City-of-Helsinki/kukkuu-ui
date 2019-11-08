import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './languageDropdown.module.scss';
import Select from '../../../../../common/components/select/Select';
import { SUPPORT_LANGUAGES } from '../../../../../common/translation/TranslationConstants';
import { updateLocaleParam } from '../../../../../common/route/RouteUtils';

const LanguageDropdown: React.FunctionComponent = () => {
  const { i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const languageOptions = Object.values(SUPPORT_LANGUAGES).map(language => {
    return {
      value: language,
      label: language.toUpperCase(),
    };
  });
  const currentLanguage = i18n.languages[0];

  return (
    <div className={styles.languageDropdown}>
      <Select
        options={languageOptions}
        value={currentLanguage}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          history.push(
            updateLocaleParam(
              location.pathname,
              currentLanguage,
              e.target.value
            )
          )
        }
        id="languageDropdownNavbar"
      />
    </div>
  );
};

export default LanguageDropdown;
