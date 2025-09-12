import { useParams } from 'react-router';

import { AppRouteProps } from './AppRoute';

export const localeParam = ':locale';

export default function useAppRouteHref(
  appRoutePath: NonNullable<AppRouteProps['path']>
) {
  const { locale } = useParams();

  if (locale) {
    return appRoutePath.replace(localeParam, locale).replace('*', '');
  }

  return appRoutePath.replace(`/${localeParam}`, '').replace('*', '');
}
