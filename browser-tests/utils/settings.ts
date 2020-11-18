import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const getEnvOrError = (key: string) => {
  const variable = process.env[key];

  if (!variable) {
    throw new Error(`No ${key} specified.`);
  }

  return variable;
};

export const testUsername = (): string =>
  getEnvOrError('BROWSER_TESTS_USER_NAME');

export const testUserPassword = (): string =>
  getEnvOrError('BROWSER_TESTS_USER_PASSWORD');

export const envUrl = (): string => getEnvOrError('BROWSER_ENV_URL');
