import { User } from 'oidc-client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import i18n from '../../common/translation/i18n/i18nInit';
import userManager from './userManager';

// eslint-disable-next-line import/no-anonymous-default-export
export default function (): Promise<User> {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await userManager.getUser();
      if (user) {
        resolve(user);
      } else {
        Sentry.captureMessage('getAuthenticatedUser user unset');
        // eslint-disable-next-line no-console
        console.error('getAuthenticatedUser user unset');
        toast.error(i18n.t('api.errorMessage'));
        reject();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error(i18n.t('api.errorMessage'));
      Sentry.captureException(error);
    }
  });
}
