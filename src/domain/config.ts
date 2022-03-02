class Config {
  static get featureFlagShowCoronaInfo() {
    return process.env.REACT_APP_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO === 'true';
  }

  static get adminUrl() {
    return process.env.REACT_APP_ADMIN_TICKET_VALIDATION_URL;
  }
}

export default Config;
