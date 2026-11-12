import { PostProcessorModule } from 'i18next';

import AppConfig from '../../../domain/app/AppConfig';
import { isCimodeActive } from './cimodeUtils';

export const CIMODE_POST_PROCESSOR_NAME = 'cimode';

/**
 * An i18next postProcessor module that intercepts translation outputs.
 *
 * When CIMODE is active (enabled via `?cimode=true` URL parameter or the footer
 * translation tool), this post-processor replaces translated strings with their
 * translation keys (e.g. `auth.login.title`), allowing translators and developers
 * to inspect keys directly in the UI.
 *
 * It leaves backend/integration queries and language headers (`i18n.language`,
 * `getCurrentLanguage(i18n)`) untouched so integration systems (Apollo GraphQL,
 * Headless CMS, Intl.DateTimeFormat, and HDS authentication) continue using
 * the active route language (such as Finnish, Swedish, or English).
 */
export const cimodePostProcessor: PostProcessorModule = {
  type: 'postProcessor',
  name: CIMODE_POST_PROCESSOR_NAME,
  process(value, key, options) {
    if (!AppConfig.translationToolEnabled || !isCimodeActive()) {
      return value;
    }

    // Preserve non-string or structured values (e.g., returnObjects: true)
    if (typeof value === 'object' && value !== null) {
      return value;
    }

    const rawKey = Array.isArray(key) ? key[0] : key;

    // Prefix custom namespace only if explicit and not the default 'translation'
    const ns = typeof options?.ns === 'string' ? options.ns : undefined;
    if (ns && ns !== 'translation' && !rawKey.startsWith(`${ns}:`)) {
      return `${ns}:${rawKey}`;
    }

    return rawKey;
  },
};
