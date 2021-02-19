import { Switch, Redirect, useParams } from 'react-router';
import React from 'react';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

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

  const { locale } = useParams<{ locale: string }>();
  const userHasProfile = useSelector(userHasProfileSelector);
  const isSessionPromptOpen = useSelector(isSessionExpiredPromptOpen);

  return (
    <>
      <AppTitleAnnouncer />
      {isSessionPromptOpen && <SessionAlert isOpen={isSessionPromptOpen} />}
      <Switch>
        <Redirect exact path={`/${locale}/`} to={`/${locale}/home`} />
        <AppRoute exact path={`/${locale}/home`} component={Home} />
        <AppRoute
          exact
          path={`/${locale}/registration/not-eligible`}
          component={NotEligible}
        />
        <AppRoute
          exact
          path={`/${locale}/wrong-login-method`}
          component={WrongLoginMethod}
        />
        <AppRoute
          exact
          path={`/${locale}/accessibility`}
          component={AccessibilityStatement}
        />
        <AppRoute exact path={`/${locale}/terms`} component={TermsOfService} />
        {!userHasProfile && (
          <AppRoute
            isPrivate
            exact
            path={`/${locale}/registration/form`}
            component={RegistrationForm}
          />
        )}
        <AppRoute
          isPrivate
          exact
          path={`/${locale}/registration/success`}
          component={Welcome}
        />

        <AppRoute
          isPrivate
          path={`/${locale}/profile`}
          component={ProfileRoute}
        />

        <AppRoute isPrivate path={`/${locale}/event`} component={EventRoute} />

        {userHasProfile && <Redirect to={`/${locale}/profile`} />}

        <AppRoute component={NotFound} />
      </Switch>
    </>
  );
};

export default App;
