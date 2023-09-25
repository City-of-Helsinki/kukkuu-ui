import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import Home from '../home/Home';
import NotEligible from '../registration/notEligible/NotEligible';
import WrongLoginMethod from '../auth/WrongLoginMethod';
import RegistrationForm from '../registration/form/RegistrationForm';
import Welcome from '../registration/welcome/Welcome';
import AccessibilityStatement from '../accessibilityStatement/AccessibilityStatement';
import TermsOfService from '../termsOfService/TermsOfService';
import ProfileRoute from '../profile/route/ProfileRoute';
import EventRoute from '../event/route/EventRoute';
import { AppRouteProps } from './AppRoute';
import HeadlessCmsPage from '../headlessCms/HeadlessCmsPage';

export const localeParam = `:locale`;

const appRoutes: Record<string, AppRouteProps> = {
  home: {
    index: true,
    title: 'appName',
    path: `/`,
    element: <Home />,
  },
  oldHome: {
    title: 'appName',
    path: `/home`,
    element: <Home />,
  },
  registrationNotEligible: {
    title: 'registration.notEligible.title',
    path: `/registration/not-eligible`,
    element: <NotEligible />,
  },
  wrongLoginMethod: {
    title: 'auth.wrongLoginMethod.title',
    path: `/wrong-login-method`,
    element: <WrongLoginMethod />,
  },
  accessibility: {
    title: 'accessibilityStatement.title',
    path: `/accessibility`,
    element: <AccessibilityStatement />,
  },
  termsOfService: {
    title: 'termsOfService.title',
    path: `/terms`,
    element: <TermsOfService />,
  },
  registrationForm: {
    title: 'registration.heading',
    isPrivate: true,
    path: `/registration/form`,
    element: <RegistrationForm />,
  },
  registrationSuccess: {
    title: 'registration.welcome.hero.header',
    isPrivate: true,
    path: `/registration/success`,
    element: <Welcome />,
  },
  profile: {
    noTitle: true,
    isPrivate: true,
    path: `/profile/*`,
    element: <ProfileRoute />,
  },
  event: {
    noTitle: true,
    isPrivate: true,
    path: `/event/*`,
    element: <EventRoute />,
  },
  cms: {
    noTitle: true,
    path: `*`,
    element: <HeadlessCmsPage />,
  },
} as const;

export default appRoutes;
