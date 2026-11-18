# Header Navigation Architecture & RHHC Customization Guide

## Overview

In `kukkuu-ui`, the primary navigation header was originally provided by `@city-of-helsinki/react-helsinki-headless-cms` (RHHC) through its `Navigation` component. While RHHC provides basic integration between WordPress headless menus and Helsinki Design System (HDS) Header primitives, its default implementation contained architectural constraints and bugs that degraded the user experience (notably in mobile drawer navigation and loading states).

To resolve these issues while maintaining full upstream compatibility for future library updates, `kukkuu-ui` uses an in-house presentational component: **`HeaderNavigation`** (`src/domain/app/navigation/HeaderNavigation.tsx`).

---

## Upstream RHHC Limitations Addressed

The table below contrasts `@city-of-helsinki/react-helsinki-headless-cms`'s `Navigation` with `HeaderNavigation`:

| Feature / Area                   | Upstream RHHC `Navigation`                                                                           | Kukkuu `HeaderNavigation`                                                            | Impact / Resolution                                                                                        |
| :------------------------------- | :--------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| **Title & Logo `href`**          | Hardcoded to `"#"` on `Header.ActionBar`                                                             | Dynamic localized root path (`/` or `/${language}`)                                  | Right-click "Open in new tab", cmd/ctrl-click, and bookmarks work properly.                                |
| **Mobile Drawer Frontpage Link** | Cloned as `<Header.Link label={siteName} href="#" />`. HDS does **not** attach `onTitleClick` to it. | Dynamic `href={titleHref ?? defaultRootPath}` with React Router SPA routing          | Clicking "Kulttuurin kummilapset" in mobile drawer navigates to the frontpage instead of appending `#`.    |
| **Frontpage Link Label**         | Hardcoded to `siteName` from `useConfig()`                                                           | Explicit `frontPageLabel` prop with fallback to `siteName`                           | Allows independent control of the mobile drawer root link text.                                            |
| **Desktop Menu Skeletons**       | **Not supported**. Renders empty while GraphQL query is in flight.                                   | Shimmering pill skeletons displayed at `@include layout.respond-above(l)` (>= 992px) | Prevents Cumulative Layout Shift (CLS = 0) during navigation loading.                                      |
| **Mobile Drawer Skeletons**      | **Not supported**. Drawer is empty below profile item while menu loads.                              | 4-row skeleton lines rendered inside the mobile drawer (`UserNavigation`)            | Clear visual feedback on mobile devices while fetching CMS menus.                                          |
| **Static Links Injection**       | Only maps WordPress GraphQL nodes (`menu.menuItems.nodes`)                                           | Supports `staticItems?: MenuItem[]` merged with CMS nodes                            | Allows adding static routes (e.g. static pages, instructions) without CMS schema hacks.                    |
| **Query Deduplication**          | Automatically calls `useMenuQuery` if `menuName` is passed                                           | Pure presentational component; queries remain in parent container                    | Parent controls prefetching (`scheduleIdle`), loading state, and error handling without duplicate queries. |
| **RHHC Config Alignment**        | Internal to RHHC package                                                                             | **100% aligned**: consumes `useConfig()` for siteName, copy, components, and utils   | Seamless drop-in replacement; zero friction for future upstream migration.                                 |

---

## Architectural Principles

### 1. Maximum RHHC Configuration Reuse

`HeaderNavigation` is explicitly built to preserve 100% architectural alignment with RHHC. It consumes `useConfig()` from `@city-of-helsinki/react-helsinki-headless-cms`:

- **`siteName`**: Default title and frontpage label.
- **`currentLanguageCode`**: Active language code (`LanguageCodeEnum`).
- **`copy`**: HDS strings (`menuButtonLabel`, `menuToggleAriaLabel`, `skipToContentLabel`).
- **`components.A`**: React Router SPA link component configured in `useRHHCConfig.tsx`.
- **`mainContentId`**: Focus anchor for `Header.SkipLink` (`#main_content`).
- **`utils.getRoutedInternalHref`**: Language-aware internal link resolver.
- **`utils.redirectToUrl`**: Language switch redirect handler.
- **`fallbackTranslations`**: Localized logo SVGs (`logoFi`, `logoSv`), alt text, and aria labels.
- **Language helpers**: `findLanguage`, `isNonEmptyLanguage`, `languageSorter`, `toPrimaryLanguageOption`.

Because `HeaderNavigation` relies on `useConfig()`, any updates or global configuration changes configured in `useRHHCConfig` automatically reflect across the header.

### 2. Separation of Concerns: Container vs. Presentational

```
src/domain/app/navigation/
├── Navigation.tsx            # Container: GraphQL query, idle prefetching, language URL resolution
├── HeaderNavigation.tsx      # Pure Presentational: HDS Header, Action Bar, Navigation Menu, Skeletons
├── UserNavigation.tsx        # Profile & Login Action Bar item (with mobile drawer skeleton)
├── navigationUtils.ts        # Pure helpers: active link matching, idle scheduler, user display initials
└── navigation.module.scss    # Responsive styling & skeleton bar breakpoints
```

1. **`Navigation.tsx` (Container)**:

   - Fetches menu data with `useMenuQuery`.
   - Schedules background prefetching for CMS pages via `requestIdleCallback`.
   - Computes localized language switch URLs using `useCmsLanguageOptions`.
   - Passes data, active path checkers, and loading states down to `HeaderNavigation`.

2. **`HeaderNavigation.tsx` (Presentational)**:
   - Renders HDS `Header`, `Header.SkipLink`, `Header.ActionBar`, `Header.LanguageSelector`, and `Header.NavigationMenu`.
   - When `isLoading={true}`, renders `.navSkeletonBar` with shimmer pills on desktop (`>= 992px`).
   - When `isLoading={false}`, renders CMS and static navigation links using `components.A` for SPA routing.

---

## Responsive Breakpoint Alignment

HDS Header toggles between desktop navigation and the mobile drawer at breakpoint **`l` (992px)** (`useMediaQueryLessThan('l')`).

To avoid layout shifts or double-rendering:

- **Desktop Skeleton (`.navSkeletonBar`)**:
  - Below `992px`: `display: none;` (hidden).
  - At or above `992px` (`@include layout.respond-above(l)`): `display: flex; min-height: 4rem;`.
- **Mobile Drawer Skeleton (`.mobileNavSkeleton`)**:
  - Rendered inside `UserNavigation` only when HDS sets `fullWidth={true}` (which HDS applies when cloning children into `#hds-mobile-menu`).

---

## Usage & Customization

### Basic Usage

```tsx
import { HeaderNavigation } from './HeaderNavigation';

<HeaderNavigation
  menu={menuQueryResult.data?.menu}
  isLoading={isNavLoading}
  getPathnameForLanguage={getPathnameForLanguage}
  getIsItemActive={getIsItemActive}
  onTitleClick={handleTitleClick}
  userNavigation={
    <UserNavigation fixedRightPosition isNavLoading={isNavLoading} />
  }
/>;
```

### Injecting Custom Static Links

```tsx
const staticItems: MenuItem[] = [
  {
    id: 'static-about',
    title: 'Tietoa palvelusta',
    label: 'Tietoa palvelusta',
    path: '/about',
    parentId: null,
  },
];

<HeaderNavigation
  menu={menuQueryResult.data?.menu}
  staticItems={staticItems}
/>;
```

### Overriding Logo, Title, and Frontpage Label

```tsx
<HeaderNavigation
  title="Kulttuurin kummilapset"
  titleHref="/fi"
  frontPageLabel="Etusivu"
  logoHref="/fi"
  logo={<Logo src={customLogoSvg} alt="Kukkuu" size={LogoSize.Large} />}
  logoAriaLabel="Kukkuu etusivulle"
/>
```

---

## Migration Roadmap for Future Upstream RHHC Updates

If `@city-of-helsinki/react-helsinki-headless-cms` releases updates that address:

1. Dynamic `titleHref` / `logoHref` (not hardcoded to `"#"`).
2. Proper mobile drawer link handling without broken hash navigation.
3. First-class loading skeleton states.
4. Static items support.

Migrating back to upstream RHHC will be seamless because:

- `HeaderNavigation` uses the exact same prop signatures as RHHC `NavigationProps` (`menu`, `universalBarMenu`, `languages`, `onTitleClick`, `getPathnameForLanguage`, `getIsItemActive`, `userNavigation`).
- All routing and configuration primitives already route through `useConfig()`.
