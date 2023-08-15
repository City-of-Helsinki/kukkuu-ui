import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const getEnvOrError = (key: string) => {
  const variable = process.env[key];

  if (!variable) {
    throw new Error(`No ${key} specified.`);
  }

  return variable;
};

const getApiBaseUrl = () => {
  const url = process.env['BROWSER_TESTS_API_URL'] ?? '';

  // API url might ppoint to graphql, remvoe
  var re = /\/graphql$/;
  return url.replace(re, "");
};


export const testUsername = (): string =>
  getEnvOrError('BROWSER_TESTS_USER_NAME');

export const testUserPassword = (): string =>
  getEnvOrError('BROWSER_TESTS_USER_PASSWORD');

export const envUrl = (): string => getEnvOrError('BROWSER_TESTS_ENV_URL');

// optional variable for API to ensure tunnistamo user accesses
export const apiUrl = (): string => getApiBaseUrl();
