import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {
  IconAlertCircleFill,
  IconCheck,
  IconFamily,
  IconUniversalAccess,
  StatusLabel,
} from 'hds-react';
import classNames from 'classnames';

import {
  EnrolmentDeniedReason,
  EventParticipantsPerInvite,
  TicketSystem,
} from '../../api/generatedTypes/graphql';
import { externalTicketSystems } from '../constants/ExternalTicketSystemConstants';
import {
  extractEventAccessibilityCounts,
  getSpeechlessOccurrencesCount,
  isEventFull,
  type AccessibilityBadgeCount,
} from '../EventUtils';
import styles from './eventBadges.module.scss';

const KNOWN_ACCESSIBILITY_KEYS = new Set([
  'mobility',
  'sensory',
  'neurodiversity',
  'vision',
  'hearing',
]);

/**
 * Resolves the localized display label for an external ticket system provider.
 */
const getTicketSystemLabel = (
  type: TicketSystem | string,
  t: TFunction
): string => {
  switch (type) {
    case TicketSystem.Ticketmaster:
      return t('event.ticketSystem.ticketmaster', 'Ticketmaster');
    case TicketSystem.Lippupiste:
      return t('event.ticketSystem.lippupiste', 'Lippupiste');
    case TicketSystem.Tixly:
      return t('event.ticketSystem.tixly', 'Tixly');
    default:
      return '';
  }
};

/**
 * Resolves the display label for an external ticket system badge, or null if not applicable.
 */
const getTicketSystemBadgeLabel = (
  ticketSystem: EventBadgesEvent['ticketSystem'],
  t: TFunction
): string | null => {
  const type = ticketSystem?.type;
  if (!type) return null;
  if (!externalTicketSystems.includes(type as TicketSystem)) return null;
  return getTicketSystemLabel(type, t);
};

const resolveAccessibilityLabel = (rawValue: string, t: TFunction): string => {
  const normalized = rawValue.trim().toLowerCase();
  if (KNOWN_ACCESSIBILITY_KEYS.has(normalized)) {
    return t(`search.filter.accessibility.${normalized}`);
  }
  return rawValue;
};

/**
 * Builds badge items for unique accessibility features.
 */
const buildAccessibilityBadgeItems = (
  accessibilityCounts: AccessibilityBadgeCount[],
  showCount: boolean,
  t: TFunction
): Array<{ key: string; node: React.ReactNode }> =>
  accessibilityCounts.map((acc) => {
    const baseLabel = resolveAccessibilityLabel(acc.value, t);
    const labelText =
      showCount && acc.count > 0
        ? t('search.card.badgeWithCount', {
            label: baseLabel,
            count: acc.count,
          })
        : baseLabel;

    return {
      key: `accessibility-${acc.value}`,
      node: (
        <span
          className={classNames(styles.badge, styles.whiteBadge)}
          data-testid={`event-badge-accessibility-${acc.value}`}
        >
          <IconUniversalAccess
            aria-hidden="true"
            className={styles.badgeIcon}
          />
          <span>{labelText}</span>
        </span>
      ),
    };
  });

/**
 * Builds badge item for speechless ("zxx") performances, or null if none.
 */
const buildSpeechlessBadgeItem = (
  speechlessCount: number,
  showCount: boolean,
  t: TFunction
): { key: string; node: React.ReactNode } | null => {
  if (speechlessCount <= 0) return null;

  const baseLabel = t('common.language.zxx');
  const labelText = showCount
    ? t('search.card.badgeWithCount', {
        label: baseLabel,
        count: speechlessCount,
      })
    : baseLabel;

  return {
    key: 'speechless',
    node: (
      <span
        className={classNames(styles.badge, styles.whiteBadge)}
        data-testid="event-badge-speechless"
      >
        <IconUniversalAccess
          aria-hidden="true"
          className={styles.badgeIcon}
        />
        <span>{labelText}</span>
      </span>
    ),
  };
};

export type EventBadgesThemePath = {
  id?: string | null;
  slug: string;
  name?: string | null;
};

export type EventBadgesOccurrence = {
  id?: string;
  remainingCapacity?: number | null;
  occurrenceLanguage?: string | null;
  /** TODO(backend): Refactor once occurrence accessibilities field lands in GraphQL API */
  accessibilities?: string[] | null;
};

export type EventBadgesEvent = {
  id: string;
  participantsPerInvite?: EventParticipantsPerInvite | null;
  enrolmentDeniedReason?: EnrolmentDeniedReason | null;
  themePaths?: Array<EventBadgesThemePath | null> | null;
  /** TODO(backend): Refactor once event accessibilities field lands in GraphQL API */
  accessibility?: string[] | null;
  accessibilities?: string[] | null;
  ticketSystem?: {
    type?: TicketSystem | string | null;
    hasAnyFreePasswords?: boolean | null;
  } | null;
};

export type EventBadgesProps = {
  event: EventBadgesEvent;
  occurrences?: EventBadgesOccurrence[];
  isEnrolled?: boolean;
  isEnrolledInSeasonSibling?: boolean;
  showCount?: boolean;
  whiteTags?: boolean;
  enrolledBadgeText?: string;
  enrolledBadgeTestId?: string;
  seasonEnrolledBadgeTestId?: string;
  className?: string;
};

/**
 * Shared badge list for `EventSearchCard` and `EventHero`.
 * Renders enrolment status, external ticket system provider, Full badge,
 * Theme path badges, Family event badge, Accessibility badges, and Speechless ("zxx") badge.
 */
export const EventBadges: React.FC<EventBadgesProps> = ({
  event,
  occurrences = [],
  isEnrolled = false,
  isEnrolledInSeasonSibling = false,
  showCount = false,
  whiteTags = false,
  enrolledBadgeText,
  enrolledBadgeTestId,
  seasonEnrolledBadgeTestId,
  className,
}) => {
  const { t } = useTranslation();

  const ticketSystemLabel = getTicketSystemBadgeLabel(event.ticketSystem, t);

  const isFull = isEventFull(event, occurrences);

  const themePaths = (event.themePaths ?? []).filter(
    (tp): tp is EventBadgesThemePath =>
      Boolean(tp && (tp.name || tp.slug))
  );

  const isFamilyEvent =
    event.participantsPerInvite === EventParticipantsPerInvite.Family;

  const accessibilityCounts = extractEventAccessibilityCounts(
    event,
    occurrences
  );

  const speechlessCount = getSpeechlessOccurrencesCount(occurrences);

  const items: Array<{ key: string; node: React.ReactNode }> = [];

  if (isEnrolled) {
    items.push({
      key: 'enrolled',
      node: (
        <span
          className={classNames(styles.badge, styles.enrolledBadge)}
          data-testid={enrolledBadgeTestId}
        >
          <IconCheck aria-hidden="true" className={styles.badgeIcon} />
          <span>{enrolledBadgeText || t('search.card.enrolledBadge')}</span>
        </span>
      ),
    });
  }

  if (isEnrolledInSeasonSibling) {
    items.push({
      key: 'season-sibling',
      node: (
        <StatusLabel
          type="neutral"
          className={styles.seasonEnrolledBadge}
          data-testid={seasonEnrolledBadgeTestId}
        >
          {t('search.card.alreadyEnrolledSeasonBadge')}
        </StatusLabel>
      ),
    });
  }

  if (ticketSystemLabel) {
    items.push({
      key: 'ticket-system',
      node: (
        <span className={classNames(styles.badge, styles.greyBadge)}>
          {ticketSystemLabel}
        </span>
      ),
    });
  }

  if (isFull) {
    items.push({
      key: 'full',
      node: (
        <span
          className={classNames(styles.badge, styles.blackBadge)}
          data-testid="event-badge-full"
        >
          <IconAlertCircleFill
            aria-hidden="true"
            className={styles.badgeIcon}
          />
          <span>{t('event.occurrencesTable.fullBadge')}</span>
        </span>
      ),
    });
  }

  for (const tp of themePaths) {
    const pathLabel = tp.name || tp.slug;
    items.push({
      key: `theme-path-${tp.id || tp.slug}`,
      node: (
        <span
          className={classNames(styles.badge, styles.themePathBadge)}
          data-testid={`event-badge-theme-path-${tp.slug}`}
        >
          <span>
            {t('profile.child.themePath', { themePath: pathLabel })}
          </span>
        </span>
      ),
    });
  }

  if (isFamilyEvent) {
    items.push({
      key: 'family-event',
      node: (
        <span
          className={classNames(styles.badge, styles.greyBadge)}
          data-testid="event-badge-family"
        >
          <IconFamily aria-hidden="true" className={styles.badgeIcon} />
          <span>{t('search.card.familyEventBadge')}</span>
        </span>
      ),
    });
  }

  items.push(
    ...buildAccessibilityBadgeItems(accessibilityCounts, showCount, t)
  );

  const speechlessItem = buildSpeechlessBadgeItem(
    speechlessCount,
    showCount,
    t
  );
  if (speechlessItem) {
    items.push(speechlessItem);
  }

  if (items.length === 0) {
    return null;
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-redundant-roles
    <ul
      role="list"
      className={classNames(
        styles.badgeList,
        { [styles.whiteTags]: whiteTags },
        className
      )}
    >
      {items.map((item) => (
        <li key={item.key} className={styles.badgeItem}>
          {item.node}
        </li>
      ))}
    </ul>
  );
};

export default EventBadges;
