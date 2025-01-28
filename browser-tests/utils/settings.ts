import * as fs from 'fs';

import * as dotenv from 'dotenv';

const browserTestEnvFilePath = '.env.test.local';

if (fs.existsSync(browserTestEnvFilePath)) {
  // eslint-disable-next-line no-console
  console.info(
    `Using "${browserTestEnvFilePath}" to populate environment variables for browser tests.`
  );
  dotenv.config({ path: browserTestEnvFilePath });
} else {
  // eslint-disable-next-line no-console
  console.info(
    'HINT: If you are running the Testcafe tests locally, ' +
      `you could take advantage of "${browserTestEnvFilePath}" file ` +
      'to populate environment variables for browser tests.'
  );
}

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
  const re = /\/graphql$/;
  return url.replace(re, '');
};

export const envUrl = (): string => getEnvOrError('BROWSER_TESTS_ENV_URL');

// optional variable for API to ensure tunnistamo user accesses
export const apiUrl = (): string => getApiBaseUrl();
