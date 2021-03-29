import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { Dispatch } from '@reduxjs/toolkit';

import i18n from '../../common/translation/i18n/i18nInit';
import userManager from './userManager';
import {
  startFetchingToken,
  fetchTokenSuccess,
  fetchTokenError,
} from './state/BackendAuthenticationActions';
import { TUNNISTAMO_API_TOKEN_ENDPOINT } from '../api/constants/ApiConstants';
import { BackendTokenResponse } from './types/BackendAuthenticationTypes';
import { getCurrentLanguage } from '../../common/translation/TranslationUtils';
import apiTokenService from './apiTokenService';

export const loginTunnistamo = (path?: string) => {
  userManager
    .signinRedirect({
      data: { path: path || 'profile' },
      /* eslint-disable @typescript-eslint/camelcase */
      ui_locales: getCurrentLanguage(i18n),
    })
    .catch((error) => {
      if (error.message === 'Network Error') {
        toast.error(i18n.t('authentication.networkError.message'));
      } else {
        toast.error(i18n.t('authentication.errorMessage'));
      }
      Sentry.captureException(error);
      // eslint-disable-next-line no-console
      console.error(error);
    });
};

export const logoutTunnistamo = async () => {
  try {
    document.cookie = 'loggedOut=1; max-age=10';
    apiTokenService.clear();
    await userManager.signoutRedirect();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    Sentry.captureException(error);
  }
};

export async function authenticateWithBackend(
  accessToken: string,
  dispatch: Dispatch
) {
  try {
    dispatch(startFetchingToken());

    const res: AxiosResponse<BackendTokenResponse> = await axios.post(
      TUNNISTAMO_API_TOKEN_ENDPOINT,
      {},
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      }
    );

    apiTokenService.apiToken = Object.values(res.data)[0];
    dispatch(fetchTokenSuccess(res.data));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    dispatch(fetchTokenError(error));
    toast.error(i18n.t('authentication.errorMessage'));
  }
}
