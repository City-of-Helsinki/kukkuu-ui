import { Redirect, Switch } from 'react-router';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

import { userHasProfileSelector } from '../registration/state/RegistrationSelectors';
import { isSessionExpiredPromptOpenSelector } from './state/ui/UISelectors';
import SessionAlert from './sessionAlert/SessionAlert';
import PageLayout from './layout/PageLayout';
import useHashAnchorLinks from './useHashAnchorLinks';
import AppTitleAnnouncer from './AppTitleAnnouncer';
import AppRoute from './AppRoute';
import appRoutes from './appRoutes';
import useGetPathname from '../../common/route/utils/useGetPathname';

const App = () => {
  useHashAnchorLinks();

  const { t } = useTranslation();
  const userHasProfile = useSelector(userHasProfileSelector);
  const isSessionPromptOpen = useSelector(isSessionExpiredPromptOpenSelector);
  const getPathname = useGetPathname();

  return (
    <PageLayout>
      <AppTitleAnnouncer />
      {isSessionPromptOpen && <SessionAlert isOpen={isSessionPromptOpen} />}
      <Switch>
        {Object.values(appRoutes).map(
          ({ title, exact, path, component, isPrivate, noTitle }) => {
            // Don't render registration form when user has a profile,
            // but redirect the user to the profile page instead.
            if (path === appRoutes.registrationForm.path && userHasProfile) {
              <Redirect to={getPathname('/profile')} />;
            }

            return (
              <AppRoute
                key={path as string}
                title={title ? t(title) : undefined}
                exact={exact}
                path={path}
                component={component}
                isPrivate={isPrivate}
                noTitle={noTitle}
              />
            );
          }
        )}
      </Switch>
    </PageLayout>
  );
};

export default App;
