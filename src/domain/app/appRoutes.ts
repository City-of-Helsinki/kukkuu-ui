import { SUPPORT_LANGUAGES } from '../../common/translation/TranslationConstants';
import OidcCallback from '../auth/OidcCallback';
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

export const localeParam = `:locale(${SUPPORT_LANGUAGES.EN}|${SUPPORT_LANGUAGES.FI}|${SUPPORT_LANGUAGES.SV})?`;

const appRoutes: Record<string, AppRouteProps> = {
  callback: {
    path: `/${localeParam}/callback`,
    component: OidcCallback,
  },
  home: {
    title: 'appName',
    exact: true,
    path: `/${localeParam}`,
    component: Home,
  },
  oldHome: {
    title: 'appName',
    exact: true,
    path: `/${localeParam}/home`,
    component: Home,
  },
  registrationNotEligible: {
    title: 'registration.notEligible.title',
    exact: true,
    path: `/${localeParam}/registration/not-eligible`,
    component: NotEligible,
  },
  wrongLoginMethod: {
    title: 'auth.wrongLoginMethod.title',
    exact: true,
    path: `/${localeParam}/wrong-login-method`,
    component: WrongLoginMethod,
  },
  accessibility: {
    title: 'accessibilityStatement.title',
    exact: true,
    path: `/${localeParam}/accessibility`,
    component: AccessibilityStatement,
  },
  termsOfService: {
    title: 'termsOfService.title',
    exact: true,
    path: `/${localeParam}/terms`,
    component: TermsOfService,
  },
  registrationForm: {
    title: 'registration.heading',
    isPrivate: true,
    exact: true,
    path: `/${localeParam}/registration/form`,
    component: RegistrationForm,
  },
  registrationSuccess: {
    title: 'registration.welcome.hero.header',
    isPrivate: true,
    exact: true,
    path: `/${localeParam}/registration/success`,
    component: Welcome,
  },
  profile: {
    noTitle: true,
    isPrivate: true,
    path: `/${localeParam}/profile`,
    component: ProfileRoute,
  },
  event: {
    noTitle: true,
    isPrivate: true,
    path: `/${localeParam}/event`,
    component: EventRoute,
  },
} as const;

export default appRoutes;
