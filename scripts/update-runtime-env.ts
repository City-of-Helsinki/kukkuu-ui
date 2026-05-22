/* eslint-disable no-console */
import * as path from 'path';
import fs from 'fs';
import util from 'util';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const USE_TEST_ENV = process.env.NODE_ENV === 'test';
const defaultNodeEnv = USE_TEST_ENV ? 'test' : 'development';

const env: Record<string, string> = {
  NODE_ENV: process.env.NODE_ENV || defaultNodeEnv,
};

dotenv.config({
  processEnv: env,
  ...(USE_TEST_ENV
    ? { path: ['.env', '.env.test'] }
    : { path: ['.env', `.env.${env.NODE_ENV}`, '.env.development.local'] }),
  override: true,
});

// Prevent collision if app is running while tests are started
const configFile = USE_TEST_ENV ? 'test-env-config.js' : 'env-config.js';

const configurationFile: string = path.join(
  __dirname,
  '../public/' + configFile
);
const packageJsonPath = path.join(__dirname, '../package.json');

type PackageJson = {
  name?: string;
  version?: string;
};

function applyPackageMetadataEnv() {
  const packageJson: PackageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf8')
  );

  const appName = packageJson.name;
  const appVersion = packageJson.version;
  if (appName) {
    env.VITE_APPLICATION_NAME = appName;
  }

  if (appVersion) {
    env.VITE_VERSION = appVersion;
  }
}

const start = async () => {
  try {
    applyPackageMetadataEnv();

    fs.writeFile(
      configurationFile,
      'globalThis.window._env_ = ' + util.inspect(env, false, 2, false),
      function (err) {
        if (err) {
          console.error(err instanceof Error ? err.message : String(err));
          process.exit(1);
        }
        console.log('File created!');
      }
    );
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
};

start();
