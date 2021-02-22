import { Switch, Redirect, useParams } from 'react-router';
import React from 'react';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

import Home from '../home/Home';
import NotFound from './notFound/NotFound';
import NotEligible from '../registration/notEligible/NotEligible';
import WrongLoginMethod from '../auth/WrongLoginMethod';
import RegistrationForm from '../registration/form/RegistrationForm';
import Welcome from '../registration/welcome/Welcome';
import AccessibilityStatement from '../accessibilityStatement/AccessibilityStatement';
import { userHasProfileSelector } from '../registration/state/RegistrationSelectors';
import TermsOfService from '../termsOfService/TermsOfService';
import { isSessionExpiredPromptOpen } from './state/ui/UISelectors';
import {} from '../auth/state/BackendAuthenticationActions';
import ProfileRoute from '../profile/route/ProfileRoute';
import EventRoute from '../event/route/EventRoute';
import SessionAlert from './sessionAlert/SessionAlert';
import useHashAnchorLinks from './useHashAnchorLinks';
import AppTitleAnnouncer from './AppTitleAnnouncer';
import AppRoute from './AppRoute';

const App = () => {
  useHashAnchorLinks();

  const { t } = useTranslation();
  const { locale } = useParams<{ locale: string }>();
  const userHasProfile = useSelector(userHasProfileSelector);
  const isSessionPromptOpen = useSelector(isSessionExpiredPromptOpen);

  return (
    <>
      <AppTitleAnnouncer />
      {isSessionPromptOpen && <SessionAlert isOpen={isSessionPromptOpen} />}
      <Switch>
        <Redirect exact path={`/${locale}/`} to={`/${locale}/home`} />
        <AppRoute
          title={t('appName')}
          exact
          path={`/${locale}/home`}
          component={Home}
        />
        <AppRoute
          title={t('registration.notEligible.title')}
          exact
          path={`/${locale}/registration/not-eligible`}
          component={NotEligible}
        />
        <AppRoute
          title={t('auth.wrongLoginMethod.title')}
          exact
          path={`/${locale}/wrong-login-method`}
          component={WrongLoginMethod}
        />
        <AppRoute
          title={t('accessibilityStatement.title')}
          exact
          path={`/${locale}/accessibility`}
          component={AccessibilityStatement}
        />
        <AppRoute
          title={t('termsOfService.title')}
          exact
          path={`/${locale}/terms`}
          component={TermsOfService}
        />
        {!userHasProfile && (
          <AppRoute
            title={t('registration.heading')}
            isPrivate
            exact
            path={`/${locale}/registration/form`}
            component={RegistrationForm}
          />
        )}
        <AppRoute
          title={t('registration.welcome.hero.header')}
          isPrivate
          exact
          path={`/${locale}/registration/success`}
          component={Welcome}
        />

        <AppRoute
          noTitle
          isPrivate
          path={`/${locale}/profile`}
          component={ProfileRoute}
        />

        <AppRoute
          noTitle
          isPrivate
          path={`/${locale}/event`}
          component={EventRoute}
        />

        {userHasProfile && <Redirect to={`/${locale}/profile`} />}

        <AppRoute title={t('notFound.title')} component={NotFound} />
      </Switch>
    </>
  );
};

export default App;
