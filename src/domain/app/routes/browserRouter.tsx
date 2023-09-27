import { createBrowserRouter } from 'react-router-dom';
import { t } from 'i18next';

import { NavigateToLocalePath } from './NavigateToLocalePath';
import OidcCallback from '../../auth/OidcCallback';
import AppRoute from '../AppRoute';
import Layout from '../Layout';
import Home from '../../home/Home';
import NotEligible from '../../registration/notEligible/NotEligible';
import WrongLoginMethod from '../../auth/WrongLoginMethod';
import AccessibilityStatement from '../../accessibilityStatement/AccessibilityStatement';
import TermsOfService from '../../termsOfService/TermsOfService';
import RegistrationForm from '../../registration/form/RegistrationForm';
import Welcome from '../../registration/welcome/Welcome';
import Profile from '../../profile/Profile';
import WithLocalRoute from './WithLocaleRoute';
import HeadlessCmsPage from '../../headlessCms/HeadlessCmsPage';
import WithProfileChildRouteAuthorization from './WithProfileChildRouteAuthorization';
import ProfileChildDetail from '../../profile/children/child/ProfileChildDetail';
import EventGroupPage from '../../eventGroup/EventGroupPage';
import Event from '../../event/Event';
import ExternalTicketSystemEventIsEnrolled from '../../event/ExternalTicketSystemEventIsEnrolled';
import EventRedirect from '../../event/EventRedirect';
import EventIsEnrolled from '../../event/EventIsEnrolled';
import EnrolPage from '../../event/enrol/EnrolPage';

const browserRouter = createBrowserRouter([
  { path: '/', Component: NavigateToLocalePath },
  {
    path: '/callback',
    Component: Layout,
    children: [{ index: true, Component: OidcCallback }],
  },
  {
    path: '/:locale/*',
    Component: WithProfileChildRouteAuthorization(WithLocalRoute(Layout)),
    children: [
      {
        index: true,
        element: <AppRoute title={t('appName')} element={<Home />} />,
      },
      {
        path: 'home',
        element: <AppRoute title={t('appName')} element={<Home />} />,
      },
      {
        path: 'registration/not-eligible',
        element: (
          <AppRoute
            title={t('registration.notEligible.title')}
            element={<NotEligible />}
          />
        ),
      },
      {
        path: 'wrong-login-method',
        element: (
          <AppRoute
            title={t('auth.wrongLoginMethod.title')}
            element={<WrongLoginMethod />}
          />
        ),
      },
      {
        path: 'accessibility',
        element: (
          <AppRoute
            title={t('accessibilityStatement.title')}
            element={<AccessibilityStatement />}
          />
        ),
      },
      {
        path: 'terms',
        element: (
          <AppRoute
            title={t('termsOfService.title')}
            element={<TermsOfService />}
          />
        ),
      },
      {
        path: 'registration/form',
        element: (
          <AppRoute
            isPrivate
            title={t('registration.heading')}
            element={<RegistrationForm />}
          />
        ),
      },
      {
        path: 'registration/success',
        element: (
          <AppRoute
            isPrivate
            title={t('registration.welcome.hero.header')}
            element={<Welcome />}
          />
        ),
      },
      {
        path: 'profile/*',
        children: [
          {
            index: true,
            element: (
              <AppRoute title={t('profile.heading')} element={<Profile />} />
            ),
          },
          {
            path: 'child/:childId/*',
            children: [
              {
                index: true,
                element: (
                  <AppRoute
                    title={t('profile.child.detail.page.title')}
                    element={<ProfileChildDetail />}
                  />
                ),
              },
              {
                path: 'event-group/:eventGroupId',
                element: <AppRoute noTitle element={<EventGroupPage />} />,
              },
              {
                path: 'event/:eventId',
                element: <AppRoute noTitle element={<Event />} />,
              },
              {
                path: 'event/:eventId/past',
                element: <AppRoute noTitle element={<Event />} />,
              },
              {
                path: 'event/:eventId/external-enrolment',
                element: (
                  <AppRoute
                    noTitle
                    element={<ExternalTicketSystemEventIsEnrolled />}
                  />
                ),
              },
              {
                path: 'event/:eventId/redirect',
                element: (
                  <AppRoute
                    title={t('eventRedirectPage.metaTitle')}
                    element={<EventRedirect />}
                  />
                ),
              },
              {
                path: 'occurrence/:occurrenceId',
                element: <AppRoute noTitle element={<EventIsEnrolled />} />,
              },
              {
                path: 'event/:eventId/occurrence/:occurrenceId/enrol',
                element: (
                  <AppRoute
                    title={t('enrolPage.enrol')}
                    element={<EnrolPage />}
                  />
                ),
              },
            ],
          },
        ],
      },
      // All the rest of the localised routes should be handled as CMS pages
      {
        path: '*',
        Component: HeadlessCmsPage,
      },
    ],
  },
]);

export default browserRouter;
