import { afterEach, describe, expect, it, vi } from 'vitest';

import AppConfig from '../AppConfig';

describe('AppConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('allows overriding CMS menu names via environment variables', () => {
    vi.stubEnv('VITE_CMS_HEADER_MENU_NAME_FI', 'Custom Header FI');
    vi.stubEnv('VITE_CMS_HEADER_MENU_NAME_SV', 'Custom Header SV');
    vi.stubEnv('VITE_CMS_HEADER_MENU_NAME_EN', 'Custom Header EN');
    vi.stubEnv('VITE_CMS_FOOTER_MENU_NAME_FI', 'Custom Footer FI');
    vi.stubEnv('VITE_CMS_FOOTER_MENU_NAME_SV', 'Custom Footer SV');
    vi.stubEnv('VITE_CMS_FOOTER_MENU_NAME_EN', 'Custom Footer EN');

    expect(AppConfig.cmsHeaderMenuNames).toEqual({
      fi: 'Custom Header FI',
      sv: 'Custom Header SV',
      en: 'Custom Header EN',
    });
    expect(AppConfig.cmsFooterMenuNames).toEqual({
      fi: 'Custom Footer FI',
      sv: 'Custom Footer SV',
      en: 'Custom Footer EN',
    });
  });

  it('throws an error if a CMS header menu name environment variable is missing', () => {
    vi.stubEnv('VITE_CMS_HEADER_MENU_NAME_FI', '');
    expect(() => AppConfig.cmsHeaderMenuNames).toThrow(
      'Environment variable with name VITE_CMS_HEADER_MENU_NAME_FI was not found'
    );
  });

  it('throws an error if a CMS footer menu name environment variable is missing', () => {
    vi.stubEnv('VITE_CMS_FOOTER_MENU_NAME_FI', '');
    expect(() => AppConfig.cmsFooterMenuNames).toThrow(
      'Environment variable with name VITE_CMS_FOOTER_MENU_NAME_FI was not found'
    );
  });

  it('provides CMS context paths with defaults and env overrides', () => {
    expect(AppConfig.cmsArticlesContextPath).toBe('/articles');
    expect(AppConfig.cmsPagesContextPath).toBe('/pages');
    expect(AppConfig.cmsSearchContextPath).toBe('/search');
    expect(AppConfig.cmsProfileContextPath).toBe('/profile');

    vi.stubEnv('VITE_CMS_ARTICLES_CONTEXT_PATH', '/custom-articles');
    vi.stubEnv('VITE_CMS_PAGES_CONTEXT_PATH', '/custom-pages');
    vi.stubEnv('VITE_CMS_SEARCH_CONTEXT_PATH', '/custom-search');
    vi.stubEnv('VITE_CMS_PROFILE_CONTEXT_PATH', '/custom-profile');

    expect(AppConfig.cmsArticlesContextPath).toBe('/custom-articles');
    expect(AppConfig.cmsPagesContextPath).toBe('/custom-pages');
    expect(AppConfig.cmsSearchContextPath).toBe('/custom-search');
    expect(AppConfig.cmsProfileContextPath).toBe('/custom-profile');
  });

  it('normalizes configured CMS context paths by removing trailing slashes and ensuring leading slashes', () => {
    vi.stubEnv('VITE_CMS_SEARCH_CONTEXT_PATH', '/custom-search/');
    vi.stubEnv('VITE_CMS_PROFILE_CONTEXT_PATH', 'custom-profile///');
    vi.stubEnv('VITE_CMS_ARTICLES_CONTEXT_PATH', 'articles');
    vi.stubEnv('VITE_CMS_PAGES_CONTEXT_PATH', '/');

    expect(AppConfig.cmsSearchContextPath).toBe('/custom-search');
    expect(AppConfig.cmsProfileContextPath).toBe('/custom-profile');
    expect(AppConfig.cmsArticlesContextPath).toBe('/articles');
    expect(AppConfig.cmsPagesContextPath).toBe('/');
  });

  it('throws an error if CMS articles context path is configured as root ("/")', () => {
    vi.stubEnv('VITE_CMS_ARTICLES_CONTEXT_PATH', '/');
    expect(() => AppConfig.cmsArticlesContextPath).toThrow(
      'Configuration error: VITE_CMS_ARTICLES_CONTEXT_PATH cannot be root ("/")'
    );
  });
});
