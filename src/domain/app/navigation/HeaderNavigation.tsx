/**
 * HeaderNavigation
 *
 * A specialized presentational header component built directly on Helsinki Design System (HDS)
 * primitives, designed to be 100% compatible with `@city-of-helsinki/react-helsinki-headless-cms` (RHHC)
 * by consuming `useConfig()` for all site configurations, routing utilities, and copy.
 *
 * Architectural rationale & upstream RHHC limitations addressed:
 * 1. Hardcoded Title & Logo Hrefs:
 *    RHHC Navigation hardcodes `titleHref="#"` and `logoHref="#"` on HDS `Header.ActionBar`.
 * 2. Broken Mobile Drawer Frontpage Navigation:
 *    HDS `Header.ActionBar` in mobile view renders `<Header.Link label={frontPageLabel} href={titleHref} />`
 *    for the first static drawer link, but does NOT attach `onTitleClick` to it. Combined with RHHC's
 *    hardcoded `titleHref="#"`, clicking "Kulttuurin kummilapset" in mobile view only appended `#` to the
 *    URL instead of navigating to the frontpage. HeaderNavigation dynamically resolves `titleHref` to the
 *    localized root path (`/` or `/${language}`), fixing this cleanly at the source.
 * 3. Inflexible Frontpage Link Label:
 *    RHHC Navigation hardcodes `frontPageLabel={siteName}` with no prop to customize the mobile root link label.
 *    HeaderNavigation adds an explicit `frontPageLabel` prop with a sensible fallback.
 * 4. Missing Skeleton Loader Support:
 *    RHHC Navigation has no loading state support. While menu data is in flight, `Header.NavigationMenu`
 *    renders empty, causing Cumulative Layout Shift (CLS) on desktop and an empty drawer below profile on mobile.
 *    HeaderNavigation provides first-class `isLoading` and `renderSkeleton` support.
 * 5. No Unified Static Links Control:
 *    RHHC Navigation strictly maps CMS menu nodes without support for custom static items or unified link manipulation.
 *    HeaderNavigation supports custom `staticItems?: MenuItem[]` merged seamlessly with CMS nodes.
 * 6. Redundant Apollo Query Execution:
 *    RHHC Navigation internally executes `useMenuQuery` if `menuName` is supplied, causing duplicate query
 *    triggers when the consuming app also queries the menu for idle prefetching or loading coordination.
 *    HeaderNavigation is purely presentational; queries remain in the parent container.
 * 7. Tight Coupling to Next.js Page Reloads:
 *    RHHC Navigation uses `redirectToUrl()`, which by default reloads the page
 *    instead of utilizing React Router SPA navigation.
 */

import React from 'react';
import groupBy from 'lodash/groupBy';
import type { LanguageOption } from 'hds-react';
import { Header, Logo, LogoSize, logoFi, logoSv } from 'hds-react';
import {
  Config,
  findLanguage,
  isNonEmptyLanguage,
  Language,
  LanguageCodeEnum,
  languageSorter,
  Menu,
  MenuItem,
  NavigationProps as CmsNavigationProps,
  NonEmptyLanguage,
  toPrimaryLanguageOption,
  useConfig,
} from '@city-of-helsinki/react-helsinki-headless-cms';

import { DEFAULT_LANGUAGE } from '../../../common/translation/TranslationConstants';
import { HARDCODED_CMS_LANGUAGES } from '../../languages/constants';
import { MAIN_CONTENT_ID } from '../../constants';
import { NavMenuSkeleton } from './NavMenuSkeleton';
import MenuItemSkeleton from './MenuItemSkeleton';
import styles from './navigation.module.scss';

const TOP_LEVEL_MENU_ITEM_PARENT_ID = 'null_parent_id';

type HeaderActionBarProps = React.ComponentProps<typeof Header.ActionBar>;

export type HeaderNavigationProps = Omit<
  Partial<CmsNavigationProps>,
  'menu' | 'universalBarMenu' | 'onTitleClick'
> &
  Partial<
    Pick<
      HeaderActionBarProps,
      | 'title'
      | 'titleHref'
      | 'logo'
      | 'logoHref'
      | 'logoAriaLabel'
      | 'frontPageLabel'
      | 'onTitleClick'
      | 'onLogoClick'
    >
  > & {
    menu?: Menu | null;
    universalBarMenu?: Menu | null;
    isLoading?: boolean;
    renderSkeleton?: () => React.ReactNode;
    staticItems?: MenuItem[];
  };

interface MenuItemChildren {
  [menuItemId: string]: MenuItem[];
}

type MenuLinkProps = {
  menuItemChildren?: MenuItemChildren;
  navigationItem: MenuItem;
  getRoutedInternalHref: Config['utils']['getRoutedInternalHref'];
  getIsItemActive?: HeaderNavigationProps['getIsItemActive'];
  A: Config['components']['A'];
};

/**
 * Creates a Header.Link navigation element recursively supporting dropdown items.
 */
function createMenuLinkElement(props: MenuLinkProps) {
  const {
    menuItemChildren,
    navigationItem,
    getRoutedInternalHref,
    getIsItemActive,
    A,
  } = props;

  return (
    <Header.Link
      as={A}
      id={navigationItem.id}
      key={navigationItem.id}
      title={navigationItem.title ?? undefined}
      label={navigationItem.label ?? ''}
      href={getRoutedInternalHref(navigationItem.path)}
      active={getIsItemActive?.(navigationItem) ?? false}
      dropdownLinks={
        (menuItemChildren?.[navigationItem.id]?.length &&
          menuItemChildren[navigationItem.id]?.map((childNavigationItem) =>
            createMenuLinkElement({
              ...props,
              navigationItem: childNavigationItem,
            })
          )) ||
        undefined
      }
    />
  );
}

export function HeaderNavigation({
  menu,
  universalBarMenu,
  languages,
  className,
  userNavigation,
  title,
  titleHref,
  logo,
  logoHref,
  logoAriaLabel,
  frontPageLabel,
  onTitleClick,
  onLogoClick,
  getPathnameForLanguage,
  getIsItemActive,
  isLoading = false,
  renderSkeleton,
  staticItems,
}: HeaderNavigationProps) {
  const {
    siteName,
    currentLanguageCode,
    copy: { menuButtonLabel, menuToggleAriaLabel, skipToContentLabel },
    components: { A },
    mainContentId,
    utils: { getRoutedInternalHref, redirectToUrl },
    fallbackTranslations,
  } = useConfig();

  const defaultLanguage = DEFAULT_LANGUAGE.toString();
  const languagesData: Language[] =
    languages && languages.length > 0 ? languages : [...HARDCODED_CMS_LANGUAGES];

  const currentLanguage = findLanguage(languagesData, currentLanguageCode);

  const t = (field: keyof typeof fallbackTranslations) => {
    return fallbackTranslations[field]?.[currentLanguageCode] ?? '';
  };

  const languageOptions: LanguageOption[] = (
    languagesData.filter(isNonEmptyLanguage) as NonEmptyLanguage[]
  )
    .sort(languageSorter)
    .map((language) => toPrimaryLanguageOption(language));

  const onDidChangeLanguage = (newLanguageCode: string) => {
    const newLanguage = findLanguage(languagesData, newLanguageCode);
    const normalizedLangCode = newLanguageCode.toLowerCase();
    const fallbackPath =
      normalizedLangCode === defaultLanguage ? '/' : `/${normalizedLangCode}`;
    const url =
      newLanguage && currentLanguage && getPathnameForLanguage
        ? getPathnameForLanguage(newLanguage, currentLanguage, languagesData)
        : fallbackPath;
    if (url) {
      redirectToUrl(url);
    }
  };

  const allMenuItems: MenuItem[] = [
    ...(menu?.menuItems?.nodes ?? []),
    ...(staticItems ?? []),
  ];

  const menuItemChildren: MenuItemChildren = groupBy(
    allMenuItems,
    (menuItem: MenuItem) => menuItem.parentId ?? TOP_LEVEL_MENU_ITEM_PARENT_ID
  );

  const sharedMenuLinkProps = {
    getRoutedInternalHref,
    getIsItemActive,
    A,
  };

  const currentLang = currentLanguageCode?.toLowerCase() ?? defaultLanguage;
  const defaultRootPath = currentLang === defaultLanguage ? '/' : `/${currentLang}`;
  const resolvedTitleHref = titleHref ?? defaultRootPath;
  const resolvedLogoHref = logoHref ?? resolvedTitleHref;
  const resolvedTitle = title ?? siteName;
  const resolvedFrontPageLabel = frontPageLabel ?? resolvedTitle;

  return (
    <Header
      key={currentLanguage?.code}
      onDidChangeLanguage={onDidChangeLanguage}
      defaultLanguage={currentLanguage?.code?.toLowerCase() ?? defaultLanguage}
      languages={languageOptions}
      className={className}
      style={
        {
          '--header-max-width': 'var(--breakpoint-xl)',
        } as React.CSSProperties
      }
    >
      <Header.SkipLink
        skipTo={`#${mainContentId ?? MAIN_CONTENT_ID}`}
        label={skipToContentLabel}
      />
      {universalBarMenu && (
        <Header.UniversalBar
          primaryLinkText={t('headerUniversalBarPrimaryLinkText')}
          primaryLinkHref={t('headerUniversalBarPrimaryLinkHref')}
        >
          {universalBarMenu?.menuItems?.nodes?.map((navigationItem) =>
            createMenuLinkElement({ ...sharedMenuLinkProps, navigationItem })
          )}
        </Header.UniversalBar>
      )}
      <Header.ActionBar
        titleHref={resolvedTitleHref}
        logoHref={resolvedLogoHref}
        menuButtonLabel={menuButtonLabel}
        menuButtonAriaLabel={menuToggleAriaLabel}
        title={resolvedTitle}
        onTitleClick={onTitleClick}
        onLogoClick={onLogoClick ?? onTitleClick}
        frontPageLabel={resolvedFrontPageLabel}
        logo={
          logo ?? (
            <Logo
              size={LogoSize.Large}
              src={
                t('headerActionBarLogoSrc') ||
                (currentLanguageCode === LanguageCodeEnum.Sv ? logoSv : logoFi)
              }
              alt={t('headerActionBarLogoAlt')}
            />
          )
        }
        logoAriaLabel={logoAriaLabel ?? t('headerActionBarLogoAriaLabel')}
      >
        <Header.LanguageSelector />
        {userNavigation}
      </Header.ActionBar>
      {isLoading &&
        (renderSkeleton ? (
          renderSkeleton()
        ) : (
          <NavMenuSkeleton />
        ))}
      <Header.NavigationMenu
        className={isLoading ? styles.navMenuHiddenOnDesktop : undefined}
      >
        {isLoading ? (
          <MenuItemSkeleton />
        ) : (
          menuItemChildren[TOP_LEVEL_MENU_ITEM_PARENT_ID]?.map(
            (navigationItem) =>
              createMenuLinkElement({
                ...sharedMenuLinkProps,
                menuItemChildren,
                navigationItem,
              })
          )
        )}
      </Header.NavigationMenu>
    </Header>
  );
}

export default HeaderNavigation;
