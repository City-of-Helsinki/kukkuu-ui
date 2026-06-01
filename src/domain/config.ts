import { getEnvValue } from '../common/utils/envUtils';

class Config {
  static get featureFlagShowCoronaInfo() {
    return getEnvValue('VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO') === 'true';
  }

  static get adminUrl() {
    return getEnvValue('VITE_ADMIN_TICKET_VALIDATION_URL');
  }
}

export default Config;
