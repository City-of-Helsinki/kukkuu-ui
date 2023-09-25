import { useParams } from 'react-router-dom';
import { AppRouteProps } from './AppRoute';
import { localeParam } from './appRoutes';

export default function useAppRouteHref(
  appRoutePath: NonNullable<AppRouteProps['path']>
) {
  const { locale } = useParams();

  if (locale) {
    return appRoutePath.replace(localeParam, locale).replace('*', '');
  }

  return appRoutePath.replace(`/${localeParam}`, '').replace('*', '');
}
