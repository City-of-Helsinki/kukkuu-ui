import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { RouteProps } from 'react-router-dom';

import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';
import useInstantLogin from '../auth/useInstantLogin';
import useAuthenticated from '../auth/useAuthenticated';

export type AppRouteProps = Omit<RouteProps, 'lazy' | 'index' | 'children'> & {
  isPrivate?: boolean;
  title?: string;
  noTitle?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  index?: true;
};

function AppRoute({
  isPrivate = false,
  title,
  noTitle,
  element,
}: AppRouteProps) {
  // Note that instant login should be checked first so that it has
  // access to the path the user attempted to navigate to.
  //
  // For instance, the useAuthenticated hook replaces the current path,
  // in which case the original navigation target would be lost.
  useInstantLogin(isPrivate);
  const canRenderComponent = useAuthenticated(isPrivate);
  const { t } = useTranslation();

  if (!title && !noTitle) {
    // eslint-disable-next-line no-console
    console.warn(
      // eslint-disable-next-line max-len
      'Most app routes should have a title. If a route does not need one, explicitly state is by toggling the noTitle prop.'
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore ts2786 - https://github.com/nfl/react-helmet/issues/646 */}
      <Helmet>
        {title && (
          <title>
            {title} - {t('appName')}
          </title>
        )}
      </Helmet>
      <LoadingSpinner isLoading={!canRenderComponent}>{element}</LoadingSpinner>
    </>
  );
}

export default AppRoute;
