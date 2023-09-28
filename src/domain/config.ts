class Config {
  static get featureFlagShowCoronaInfo() {
    return import.meta.env.VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO === 'true';
  }

  static get adminUrl() {
    return import.meta.env.VITE_ADMIN_TICKET_VALIDATION_URL;
  }
}

export default Config;
