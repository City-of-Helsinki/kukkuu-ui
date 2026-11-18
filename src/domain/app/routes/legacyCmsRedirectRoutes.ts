import { type RouteObject } from 'react-router';

import LegacyCmsPageRedirect from './LegacyCmsPageRedirect';

/**
 * Redirect table of legacy top-level static/content CMS page slugs that were previously
 * used at the root level in production and have now been moved under `/pages`
 * (`AppConfig.cmsPagesContextPath`).
 *
 * Why this exists:
 * Due to technical implementation details in client-side routing and CMS prefetching,
 * all fully CMS-driven dynamic pages are grouped under the `/pages` path prefix
 * (while articles live under `/articles`, and semi-static pages like `/`, `/events`,
 * and `/profile` have dedicated React routes). Scoping dynamic CMS pages strictly
 * under `/pages` makes it unambiguous by URL path alone which pages are fully driven
 * by dynamic CMS page templates (`HeadlessCmsPage`) and which are application routes,
 * avoiding catch-all route collisions and hardcoded route blacklists.
 *
 * Supported legacy production paths redirected to `/:locale/pages/<slug>`:
 * - Finnish (`fi`):
 *   - `/fi/ajankohtaista/` -> `/fi/pages/ajankohtaista`
 *   - `/fi/kummitoimijat/` -> `/fi/pages/kummitoimijat`
 *   - `/fi/perheille/` -> `/fi/pages/perheille`
 *   - `/fi/tietoa-ja-taustaa/` -> `/fi/pages/tietoa-ja-taustaa`
 *   - `/fi/saavutettavuusseloste/` -> `/fi/pages/saavutettavuusseloste`
 *   - `/fi/kayttoehdot/` -> `/fi/pages/kayttoehdot`
 * - Swedish (`sv`):
 *   - `/sv/aktuellt/` -> `/sv/pages/aktuellt`
 *   - `/sv/sv-kenelle/` -> `/sv/pages/sv-kenelle`
 *   - `/sv/tillganglighetsutlatande/` -> `/sv/pages/tillganglighetsutlatande`
 *   - `/sv/anvandningsvillkor/` -> `/sv/pages/anvandningsvillkor`
 * - English (`en`):
 *   - `/en/news/` -> `/en/pages/news`
 *   - `/en/sponsors/` -> `/en/pages/sponsors`
 *   - `/en/terms/` -> `/en/pages/terms`
 *   - `/en/accessibility-statement/` -> `/en/pages/accessibility-statement`
 */
export const LEGACY_CMS_PAGE_SLUGS = [
  // Finnish (fi)
  'ajankohtaista',
  'kummitoimijat',
  'perheille',
  'tietoa-ja-taustaa',
  'saavutettavuusseloste',
  'kayttoehdot',
  // Swedish (sv)
  'aktuellt',
  'sv-kenelle',
  'tillganglighetsutlatande',
  'anvandningsvillkor',
  // English (en)
  'news',
  'sponsors',
  'terms',
  'accessibility-statement',
] as const;

export const getLegacyCmsPageRedirectRoutes = (): RouteObject[] =>
  LEGACY_CMS_PAGE_SLUGS.map((slug) => ({
    path: `${slug}/*`,
    Component: LegacyCmsPageRedirect,
  }));
