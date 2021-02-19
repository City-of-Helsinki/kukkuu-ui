const API_TOKEN = 'kukkuu-api-token';

class ApiTokenService {
  get apiToken() {
    return localStorage.getItem(API_TOKEN);
  }

  set apiToken(token: string | null) {
    if (token !== null) {
      localStorage.setItem(API_TOKEN, token);
    }
  }

  clear() {
    localStorage.removeItem(API_TOKEN);
  }
}

export default new ApiTokenService();
