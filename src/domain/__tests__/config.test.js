import Config from '../config';

describe('Config', () => {
  let env;

  beforeEach(() => {
    env = process.env;
  });

  afterEach(() => {
    process.env = env;
  });

  describe('featureFlagShowCoronaInfo', () => {
    it('should return true when REACT_APP_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO is true', () => {
      process.env.REACT_APP_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO = 'true';
      expect(Config.featureFlagShowCoronaInfo).toEqual(true);

      process.env.REACT_APP_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO = true;

      expect(Config.featureFlagShowCoronaInfo).toEqual(true);
    });

    it('should return false otherwise', () => {
      process.env.REACT_APP_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO = 'other string';
      expect(Config.featureFlagShowCoronaInfo).toEqual(false);

      process.env.REACT_APP_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO = undefined;
      expect(Config.featureFlagShowCoronaInfo).toEqual(false);
    });
  });
});
