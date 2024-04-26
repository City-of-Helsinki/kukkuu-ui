import { Navigation as RHHCNavigation } from 'react-helsinki-headless-cms/apollo';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { SUPPORT_LANGUAGES } from '../../../common/translation/TranslationConstants';
import replaceLocaleInPathname from '../../../common/route/utils/replaceLocaleInPathname';
import UserNavigation from './UserNavigation';

const languageToMenuNameMap = {
  [SUPPORT_LANGUAGES.FI]: 'Main Navigation FI',
  [SUPPORT_LANGUAGES.SV]: 'Main Navigation SV',
  [SUPPORT_LANGUAGES.EN]: 'Main Navigation EN',
} as const;

function Navigation() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <RHHCNavigation
      menuName={
        languageToMenuNameMap[i18n.language] ?? languageToMenuNameMap.fi
      }
      onTitleClick={() => {
        const rootPath = i18n.language === 'fi' ? '/' : `/${i18n.language}`;

        navigate(rootPath);
      }}
      getPathnameForLanguage={(language) => {
        const nextPathname = replaceLocaleInPathname(
          language.slug as string,
          location.pathname
        );

        return nextPathname ?? location.pathname;
      }}
      getIsItemActive={({ path }) => {
        return path === location.pathname;
      }}
      userNavigation={<UserNavigation />}
    />
  );
}

export default Navigation;
