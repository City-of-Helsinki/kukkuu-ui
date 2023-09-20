const API_TOKEN = 'kukkuu-api-token';

class ApiTokenService {
  static get apiToken() {
    return localStorage.getItem(API_TOKEN);
  }

  static set apiToken(token: string | null) {
    if (token !== null) {
      localStorage.setItem(API_TOKEN, token);
    }
  }

  static clear() {
    localStorage.removeItem(API_TOKEN);
  }
}

export default ApiTokenService;
