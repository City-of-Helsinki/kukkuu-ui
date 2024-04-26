import { TokenData, getApiTokensFromStorage } from 'hds-react';

import AppConfig from '../app/AppConfig';

export function getKukkuuApiTokenFromStorage(
  apiTokensStorage: TokenData | null = null
) {
  return (apiTokensStorage ?? getApiTokensFromStorage() ?? {})[
    AppConfig.oidcKukkuuApiClientId
  ];
}
