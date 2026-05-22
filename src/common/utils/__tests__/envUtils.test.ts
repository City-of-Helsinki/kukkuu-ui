import { afterEach, describe, expect, it } from 'vitest';

import { getEnvValue } from '../envUtils';

describe('getEnvValue', () => {
  const runtimeEnv = (
    globalThis.window as Window & { _env_?: Record<string, unknown> }
  )._env_;
  const processEnvBackup = { ...process.env };

  afterEach(() => {
    (globalThis.window as Window & { _env_?: Record<string, unknown> })._env_ =
      runtimeEnv;
    process.env = { ...processEnvBackup };
    delete process.env.TEST_ENV_UTILS_VALUE;
  });

  it('returns runtime-injected env value from globalThis.window._env_', () => {
    (globalThis.window as Window & { _env_?: Record<string, unknown> })._env_ =
      {
        TEST_ENV_UTILS_VALUE: 123,
      };

    expect(getEnvValue('TEST_ENV_UTILS_VALUE')).toBe('123');
  });

  it('falls back to import.meta.env when runtime and process env are missing', () => {
    (globalThis.window as Window & { _env_?: Record<string, unknown> })._env_ =
      undefined;
    delete process.env.BASE_URL;

    expect(getEnvValue('BASE_URL')).toBe(import.meta.env.BASE_URL);
  });
});
