import { User } from 'oidc-client';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

import i18n from '../../common/translation/i18n/i18nInit';
import userManager from './userManager';

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
        toast(i18n.t('api.errorMessage'), {
          type: toast.TYPE.ERROR,
        });
        reject();
      }
    } catch (error) {
      toast(i18n.t('api.errorMessage'), {
        type: toast.TYPE.ERROR,
      });
      Sentry.captureException(error);
    }
  });
}
