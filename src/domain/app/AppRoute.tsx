import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { RouteProps, useNavigate } from 'react-router';
import { useOidcClient } from 'hds-react';
import React from 'react';

export type AppRouteProps = Omit<RouteProps, 'lazy' | 'index' | 'children'> & {
  isPrivate?: boolean;
  titleKey?: string;
  noTitle?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  index?: true;
};

function AppRoute({
  isPrivate = false,
  titleKey,
  noTitle,
  element,
}: AppRouteProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Note that instant login should be checked first so that it has
  // access to the path the user attempted to navigate to.
  //
  // For instance, the useAuthenticated hook replaces the current path,
  // in which case the original navigation target would be lost.
  const { isAuthenticated } = useOidcClient();

  const canRenderComponent = !isPrivate || isAuthenticated();

  if (!titleKey && !noTitle) {
    // eslint-disable-next-line no-console
    console.warn(
      // eslint-disable-next-line max-len
      'Most app routes should have a title. If a route does not need one, explicitly state is by toggling the noTitle prop.',
      { element }
    );
  }

  const title = titleKey ? `${t(titleKey)} - ${t('appName')}` : t('appName');

  React.useEffect(() => {
    if (!canRenderComponent) {
      navigate('/unauthorized', { replace: true });
    }
  }, [canRenderComponent, navigate]);

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore ts2786 - https://github.com/nfl/react-helmet/issues/646 */}
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {element}
    </>
  );
}

export default AppRoute;
