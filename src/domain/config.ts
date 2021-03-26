class Config {
  static get featureFlagShowCoronaInfo() {
    return process.env.REACT_APP_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO === 'true';
  }
}

export default Config;
