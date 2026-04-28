import { getApiTokensFromStorage } from 'hds-react';

import { getKukkuuApiTokenFromStorage } from '../kukkuuApiUtils';
import AppConfig from '../../app/AppConfig';

const mockToken = 'mock-api-token';

vi.mock('../../app/AppConfig', () => ({
  default: { oidcKukkuuApiClientId: 'test-kukkuu-api-client-id' },
}));

vi.mock('hds-react', () => ({
  getApiTokensFromStorage: vi.fn(),
}));

describe('getKukkuuApiTokenFromStorage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns the token from provided storage', () => {
    const storage = { [AppConfig.oidcKukkuuApiClientId]: mockToken };

    const result = getKukkuuApiTokenFromStorage(storage);

    expect(result).toBe(mockToken);
    expect(getApiTokensFromStorage).not.toHaveBeenCalled();
  });

  it('falls back to getApiTokensFromStorage when no storage is provided', () => {
    vi.mocked(getApiTokensFromStorage).mockReturnValue({
      [AppConfig.oidcKukkuuApiClientId]: mockToken,
    });

    const result = getKukkuuApiTokenFromStorage();

    expect(getApiTokensFromStorage).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockToken);
  });

  it('returns undefined when provided storage does not contain the client id', () => {
    const result = getKukkuuApiTokenFromStorage({ 'other-client': 'other-token' });

    expect(result).toBeUndefined();
  });

  it('returns undefined when storage is null and getApiTokensFromStorage returns null', () => {
    vi.mocked(getApiTokensFromStorage).mockReturnValue(null);

    const result = getKukkuuApiTokenFromStorage(null);

    expect(result).toBeUndefined();
  });
});
