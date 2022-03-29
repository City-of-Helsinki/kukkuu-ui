import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import getPathname from './getPathname';

export default function useGetPathname() {
  const { i18n } = useTranslation();

  return useCallback(
    (pathname: string, language: string = i18n.language) =>
      getPathname(pathname, language),
    [i18n.language]
  );
}
