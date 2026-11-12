import { describe, it, expect, beforeEach } from 'vitest';

import { cimodePostProcessor } from '../cimodePostProcessor';
import { setCimodeActive } from '../cimodeUtils';
import i18n from '../../../test/testi18nInit';
import { getCurrentLanguage } from '../../TranslationUtils';

describe('cimodePostProcessor', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    setCimodeActive(false);
  });

  it('returns original translated value when CIMODE is inactive', () => {
    const result = cimodePostProcessor.process(
      'Kulttuurin kummilapset',
      'appName',
      {},
      {} as never
    );
    expect(result).toBe('Kulttuurin kummilapset');
  });

  it('returns key string when CIMODE is active', () => {
    setCimodeActive(true);
    const result = cimodePostProcessor.process(
      'Kulttuurin kummilapset',
      'appName',
      {},
      {} as never
    );
    expect(result).toBe('appName');
  });

  it('omits default "translation" namespace prefix', () => {
    setCimodeActive(true);
    const result = cimodePostProcessor.process(
      'Otsikko',
      'home.hero.title',
      { ns: 'translation' },
      {} as never
    );
    expect(result).toBe('home.hero.title');
  });

  it('prefixes custom namespace when not "translation"', () => {
    setCimodeActive(true);
    const result = cimodePostProcessor.process(
      'Arkistohaku',
      'archiveSearch.title',
      { ns: 'cms' },
      {} as never
    );
    expect(result).toBe('cms:archiveSearch.title');
  });

  it('does not duplicate namespace if key already starts with it', () => {
    setCimodeActive(true);
    const result = cimodePostProcessor.process(
      'Arkistohaku',
      'cms:archiveSearch.title',
      { ns: 'cms' },
      {} as never
    );
    expect(result).toBe('cms:archiveSearch.title');
  });

  it('preserves structured objects or arrays (returnObjects: true)', () => {
    setCimodeActive(true);
    const obj = { a: '1', b: '2' };
    const result = cimodePostProcessor.process(
      obj as never,
      'myDict',
      {},
      {} as never
    );
    expect(result).toEqual(obj);
  });

  it('integrates with i18n.t and leaves i18n.language and getCurrentLanguage untouched', () => {
    expect(i18n.language).toBe('fi');
    expect(getCurrentLanguage(i18n)).toBe('fi');

    // Without CIMODE
    setCimodeActive(false);
    expect(i18n.t('appName')).toBe('Kulttuurin kummilapset');

    // With CIMODE
    setCimodeActive(true);
    expect(i18n.t('appName')).toBe('appName');
    expect(i18n.t('auth.wrongLoginMethod.title')).toBe(
      'auth.wrongLoginMethod.title'
    );

    // Backend language remains 'fi'
    expect(i18n.language).toBe('fi');
    expect(getCurrentLanguage(i18n)).toBe('fi');
  });
});
