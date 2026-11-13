import {
  createBrowserRouter,
  type LoaderFunctionArgs,
  type RouteObject,
} from 'react-router';
import {
  ArticleDocument,
  PageDocument,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import headlessCmsClient from '../../headlessCms/client';
import { getArticleUriFromPathname } from '../../../utils/cmsUtils';
import AppConfig from '../AppConfig';
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
import ArticleArchivePage from '../../article/ArticleArchivePage';
import ArticlePage from '../../article/ArticlePage';
import WithProfileChildRouteAuthorization from './WithProfileChildRouteAuthorization';
import ProfileChildRedirect from './ProfileChildRedirect';
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

/**
 * Route loader for headless CMS pages.
 *
 * Preloads the CMS page into Apollo Client cache so content is readily available
 * when the page component mounts. Catches any errors so prefetch failures never
 * break client-side navigation.
 */
export const cmsPageLoader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    return await headlessCmsClient.query({
      query: PageDocument,
      variables: { id: url.pathname },
      fetchPolicy: 'cache-first',
    });
  } catch {
    return null;
  }
};

/**
 * Route loader for headless CMS articles.
 *
 * Preloads the CMS article into Apollo Client cache so article content is readily available
 * when ArticlePage mounts. Catches any errors so prefetch failures never break client-side navigation.
 */
export const cmsArticleLoader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const articleUri = getArticleUriFromPathname(url.pathname);
    if (!articleUri) {
      return null;
    }
    return await headlessCmsClient.query({
      query: ArticleDocument,
      variables: { id: articleUri },
      fetchPolicy: 'cache-first',
    });
  } catch {
    return null;
  }
};

/**
 * Generates the application route hierarchy.
 *
 * Configures top-level auth and callback routes, locale routing wrapper,
 * registration and profile views, event search and occurrences, article archives,
 * and dynamic CMS page fallbacks.
 *
 * @returns Array of RouteObject configurations for React Router.
 */
export const getAppRoutes = (): RouteObject[] => [
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
                    titleKey="profile.heading"
                    element={<ProfileChildRedirect />}
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
      {
        path: 'pages/*',
        Component: HeadlessCmsPage,
        loader: cmsPageLoader,
      },
      {
        path: AppConfig.cmsArticlesContextPath.replace(/^\/+|\/+$/g, ''),
        children: [
          {
            index: true,
            Component: ArticleArchivePage,
          },
          {
            path: '*',
            Component: ArticlePage,
            loader: cmsArticleLoader,
          },
        ],
      },
      // All the rest of the localised routes should be handled as CMS pages
      {
        path: '*',
        Component: HeadlessCmsPage,
        loader: cmsPageLoader,
      },
    ],
  },
];

const browserRouter = createBrowserRouter(getAppRoutes());

export default browserRouter;
