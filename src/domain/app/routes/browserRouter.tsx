import { createBrowserRouter } from 'react-router';

import { NavigateToLocalePath } from './NavigateToLocalePath';
import AppRoute from '../AppRoute';
import Layout from '../Layout';
import Home from '../../home/Home';
import NotEligible from '../../registration/notEligible/NotEligible';
import WrongLoginMethod from '../../auth/WrongLoginMethod';
import RegistrationForm from '../../registration/form/RegistrationForm';
import Welcome from '../../registration/welcome/Welcome';
import Profile from '../../profile/Profile';
import WithLocaleRoute from './WithLocaleRoute';
import HeadlessCmsPage from '../../headlessCms/HeadlessCmsPage';
import WithProfileChildRouteAuthorization from './WithProfileChildRouteAuthorization';
import ProfileChildDetail from '../../profile/children/child/ProfileChildDetail';
import ProfileChildEventsRedirect from './ProfileChildEventsRedirect';
import SearchRedirect from './SearchRedirect';
import ChildEventsSearch from '../../event/search/ChildEventsSearch';
import EventGroupPage from '../../eventGroup/EventGroupPage';
import Event from '../../event/Event';
import LegacyEventRedirect from './LegacyEventRedirect';
import CookieConsentPage from '../../cookieConsent/CookieConsentPage';
import Unauthorized from '../../auth/Unauthorized';
import ManageCommunicationSubscriptions from '../../profile/subscriptions/ManageSubscriptions';
import NotFound from '../notFound/NotFound';
import KukkuuHDSLoginCallbackHandler from '../../auth/KukkuuHDSLoginCallbackHandler';
import SilentRenewRedirect from './SilentRenewRedirect';
import ApplicationError from '../errorElement/ApplicationError';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <NavigateToLocalePath />,
  },
  {
    path: '/callback',
    Component: KukkuuHDSLoginCallbackHandler,
  },
  {
    path: '/silent_renew',
    element: <SilentRenewRedirect />,
  },
  {
    path: '/silent_renew.html',
  },
  {
    path: '/:locale/*',
    Component: WithProfileChildRouteAuthorization(WithLocaleRoute(Layout)),
    errorElement: <ApplicationError />,
    children: [
      {
        index: true,
        element: <AppRoute titleKey="appName" element={<Home />} />,
      },
      {
        path: 'home',
        element: <AppRoute titleKey="appName" element={<Home />} />,
      },
      {
        path: 'unauthorized',
        element: (
          <AppRoute
            titleKey="auth.unauthorized.title"
            element={<Unauthorized />}
          />
        ),
      },
      {
        path: 'wrong-login-method',
        element: (
          <AppRoute
            titleKey="auth.wrongLoginMethod.title"
            element={<WrongLoginMethod />}
          />
        ),
      },
      {
        path: 'cookie-consent',
        element: (
          <AppRoute
            titleKey="cookieConsent.title"
            element={<CookieConsentPage />}
          />
        ),
      },
      {
        path: 'registration/not-eligible',
        element: (
          <AppRoute
            titleKey="registration.notEligible.title"
            element={<NotEligible />}
          />
        ),
      },
      {
        path: 'registration/form',
        element: (
          <AppRoute
            isPrivate
            titleKey="registration.heading"
            element={<RegistrationForm />}
          />
        ),
      },
      {
        path: 'registration/success',
        element: (
          <AppRoute
            isPrivate
            titleKey="registration.welcome.hero.header"
            element={<Welcome />}
          />
        ),
      },
      {
        path: 'events',
        element: (
          <AppRoute
            isPrivate
            titleKey="search.title"
            element={<ChildEventsSearch />}
          />
        ),
      },
      {
        path: 'search',
        element: (
          <AppRoute
            isPrivate
            titleKey="search.title"
            element={<SearchRedirect />}
          />
        ),
      },
      {
        path: 'profile/*',
        children: [
          {
            index: true,
            element: (
              <AppRoute titleKey="profile.heading" element={<Profile />} />
            ),
          },
          {
            path: 'subscriptions',
            element: (
              <AppRoute
                titleKey="subscriptions.manage.title"
                element={<ManageCommunicationSubscriptions />}
              />
            ),
          },
          {
            path: 'child/:childId/*',
            children: [
              {
                index: true,
                element: (
                  <AppRoute
                    titleKey="profile.child.detail.page.title"
                    element={<ProfileChildDetail />}
                  />
                ),
              },
              {
                path: 'events',
                element: (
                  <AppRoute
                    titleKey="search.title"
                    element={<ProfileChildEventsRedirect />}
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
              /** @deprecated Legacy route for external ticket system enrolled view. Redirects to unified event page. */
              {
                path: 'event/:eventId/external-enrolment',
                element: (
                  <AppRoute
                    noTitle
                    element={<LegacyEventRedirect />}
                  />
                ),
              },
              /**
               * @deprecated Legacy route for external ticket system redirect/claim view.
               * Redirects to unified event page.
               */
              {
                path: 'event/:eventId/redirect',
                element: (
                  <AppRoute
                    noTitle
                    element={<LegacyEventRedirect />}
                  />
                ),
              },
              /**
               * @deprecated Legacy route still linked from backend e-mails (`occurrence_enrol_url`).
               * Redirects to the unified event details page.
               */
              {
                path: 'event/:eventId/occurrence/:occurrenceId/enrol',
                element: (
                  <AppRoute
                    noTitle
                    element={<LegacyEventRedirect hash="" />}
                  />
                ),
              },
            ],
          },
          {
            path: '*',
            Component: NotFound,
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
