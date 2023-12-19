import Config from '../config';

describe('Config', () => {
  const origEnv: NodeJS.ProcessEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...origEnv };
  });

  afterEach(() => {
    process.env = { ...origEnv };
  });

  describe('featureFlagShowCoronaInfo', () => {
    it('should return true when VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO is true', () => {
      process.env.VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO = 'true';
      expect(Config.featureFlagShowCoronaInfo).toEqual(true);
    });

    it('should return false otherwise', () => {
      process.env.VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO = 'other string';
      expect(Config.featureFlagShowCoronaInfo).toEqual(false);

      process.env.VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO = undefined;
      expect(Config.featureFlagShowCoronaInfo).toEqual(false);
    });
  });
});
