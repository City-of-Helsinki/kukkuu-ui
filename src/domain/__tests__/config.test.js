import Config from '../config';

describe('Config', () => {
  let env;

  beforeEach(() => {
    env = import.meta.env;
  });

  afterEach(() => {
    import.meta.env = env;
  });

  describe('featureFlagShowCoronaInfo', () => {
    it('should return true when VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO is true', () => {
      import.meta.env.VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO = 'true';
      expect(Config.featureFlagShowCoronaInfo).toEqual(true);

      import.meta.env.VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO = true;

      expect(Config.featureFlagShowCoronaInfo).toEqual(true);
    });

    it('should return false otherwise', () => {
      import.meta.env.VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO = 'other string';
      expect(Config.featureFlagShowCoronaInfo).toEqual(false);

      import.meta.env.VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO = undefined;
      expect(Config.featureFlagShowCoronaInfo).toEqual(false);
    });
  });
});
