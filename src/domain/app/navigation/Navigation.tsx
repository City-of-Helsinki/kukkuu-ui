import { useCallback } from 'react';
import { Navigation as RHHCNavigation } from 'react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Language, LanguageCodeEnum } from 'react-helsinki-headless-cms';

import { SUPPORT_LANGUAGES } from '../../../common/translation/TranslationConstants';
// import replaceLocaleInPathname from '../../../common/route/utils/replaceLocaleInPathname';
import UserNavigation from './UserNavigation';
import { useCmsLanguageOptions } from '../../../hooks/useCmsLanguageOptions';
import { stripLocaleFromUri } from '../../../utils/cmsUtils';

const languageToMenuNameMap = {
  [SUPPORT_LANGUAGES.FI]: 'Main Navigation FI',
  [SUPPORT_LANGUAGES.SV]: 'Main Navigation SV',
  [SUPPORT_LANGUAGES.EN]: 'Main Navigation EN',
} as const;

function Navigation() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const cmsLanguageOptions = useCmsLanguageOptions();

  const getHref = useCallback(
    (language: LanguageCodeEnum) => {
      const nav = cmsLanguageOptions?.find((cmsLanguageOption) => {
        return (
          cmsLanguageOption.locale?.toLowerCase() === language.toLowerCase()
        );
      });
      return `/${language.toLowerCase()}${
        stripLocaleFromUri(location.pathname)
          ? stripLocaleFromUri(nav?.uri ?? '')
          : ''
      }`;
    },
    [cmsLanguageOptions, location.pathname]
  );

  const getPathnameForLanguage = (language: Language): string => {
    const languageCode = language.code ?? LanguageCodeEnum.Fi;
    return getHref(languageCode);
  };

  return (
    <RHHCNavigation
      menuName={
        languageToMenuNameMap[i18n.language] ?? languageToMenuNameMap.fi
      }
      onTitleClick={() => {
        const rootPath = i18n.language === 'fi' ? '/' : `/${i18n.language}`;
        navigate(rootPath);
      }}
      getPathnameForLanguage={getPathnameForLanguage}
      getIsItemActive={({ path }) => {
        return path === location.pathname;
      }}
      userNavigation={<UserNavigation />}
    />
  );
}

export default Navigation;
