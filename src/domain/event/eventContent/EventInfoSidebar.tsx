import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconCalendar,
  IconClock,
  IconGlobe,
  IconLinkExternal,
  IconLocation,
  IconSize,
  IconTicket,
} from 'hds-react';

import InfoWithIcon from '../../../common/components/infoWithIcon/InfoWithIcon';
import {
  EventParticipantsPerInvite as EventParticipantsPerInviteEnum,
  TicketSystem,
} from '../../api/generatedTypes/graphql';
import { externalTicketSystems } from '../constants/ExternalTicketSystemConstants';
import {
  extractUniqueVenues,
  formatDuration,
  formatEventHeroDateTime,
  getParticipantsIcon,
} from '../EventUtils';
import { useEventLanguages } from '../hooks/useEventLanguages';
import styles from './eventInfoSidebar.module.scss';

export type EventSidebarVenue = {
  id?: string;
  name?: string | null;
  address?: string | null;
};

export type EventSidebarOccurrence = {
  id: string;
  time: string;
  occurrenceLanguage?: string | null;
  venue?: EventSidebarVenue | null;
};

export type EventSidebarEvent = {
  id: string;
  name?: string | null;
  duration?: number | null;
  participantsPerInvite?: EventParticipantsPerInviteEnum | null;
  ticketSystem?: {
    type: TicketSystem;
    childPassword?: string | null;
    url?: string | null;
  } | null;
};

/**
 * Props for {@link EventSidebarOccurrencesInfo}.
 */
export type EventSidebarOccurrencesInfoProps = {
  occurrences?: EventSidebarOccurrence[];
  occurrencesCount?: number;
  duration?: number | null;
  onViewOccurrences?: () => void;
};

/**
 * Section displaying the date range / occurrences count and an action button
 * to scroll down to the occurrences table.
 */
export const EventSidebarOccurrencesInfo: React.FC<
  EventSidebarOccurrencesInfoProps
> = ({
  occurrences = [],
  occurrencesCount,
  duration,
  onViewOccurrences,
}) => {
  const { t, i18n } = useTranslation();

  const handleScrollToOccurrences = () => {
    if (onViewOccurrences) {
      onViewOccurrences();
      return;
    }
    document
      .getElementById('occurrences-table')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const formattedDateTime = formatEventHeroDateTime({
    allOccurrences: occurrences,
    duration,
    locale: i18n.language,
    t,
  });

  const occurrencesText =
    formattedDateTime ||
    t('event.sidebar.occurrencesCount', {
      count: occurrencesCount ?? occurrences.length,
    });

  return (
    <InfoWithIcon
      icon={<IconCalendar aria-hidden="true" />}
      title={t('event.sidebar.dateTitle')}
    >
      <div className={styles.infoContent}>
        <p className={styles.textRow}>{occurrencesText}</p>
        <button
          type="button"
          onClick={handleScrollToOccurrences}
          className={styles.tableLink}
        >
          {t('event.sidebar.viewOccurrencesAndEnrol')}
        </button>
      </div>
    </InfoWithIcon>
  );
};

/**
 * Props for {@link EventSidebarDurationInfo}.
 */
export type EventSidebarTicketSystemInfoProps = {
  ticketSystem: {
    type: TicketSystem;
    childPassword?: string | null;
  };
};

export const EventSidebarTicketSystemInfo: React.FC<
  EventSidebarTicketSystemInfoProps
> = ({ ticketSystem }) => {
  const { t } = useTranslation();

  const handleScrollToTicketSystem = () => {
    document
      .getElementById('ticket-system-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const providerLabel = (() => {
    switch (ticketSystem.type) {
      case TicketSystem.Ticketmaster:
        return t('event.ticketSystem.ticketmaster', 'TicketMaster');
      case TicketSystem.Lippupiste:
        return t('event.ticketSystem.lippupiste', 'Lippupiste');
      case TicketSystem.Tixly:
        return t('event.ticketSystem.tixly', 'Tixly');
      default:
        return '';
    }
  })();

  const actionText = ticketSystem.childPassword
    ? t('event.sidebar.viewPassword')
    : t('event.sidebar.claimPassword');

  return (
    <InfoWithIcon
      icon={<IconTicket aria-hidden="true" />}
      title={t('event.sidebar.ticketSystemTitle')}
    >
      <div className={styles.infoContent}>
        <p className={styles.textRow}>{providerLabel}</p>
        <button
          type="button"
          onClick={handleScrollToTicketSystem}
          className={styles.tableLink}
        >
          {actionText}
        </button>
      </div>
    </InfoWithIcon>
  );
};

export type EventSidebarDurationInfoProps = {
  duration?: number | null;
};

/**
 * Section displaying formatted event duration, if defined.
 */
export const EventSidebarDurationInfo: React.FC<
  EventSidebarDurationInfoProps
> = ({ duration }) => {
  const { t } = useTranslation();
  const formattedDuration = formatDuration(duration);

  if (!formattedDuration) {
    return null;
  }

  return (
    <InfoWithIcon
      icon={<IconClock aria-hidden="true" />}
      title={t('event.sidebar.durationTitle')}
    >
      <div className={styles.infoContent}>
        <p className={styles.textRow}>{formattedDuration}</p>
      </div>
    </InfoWithIcon>
  );
};

/**
 * Props for {@link EventSidebarLocationInfo}.
 */
export type EventSidebarLocationInfoProps = {
  venues: EventSidebarVenue[];
};

/**
 * Section displaying unique venue locations and Google Maps links.
 */
export const EventSidebarLocationInfo: React.FC<
  EventSidebarLocationInfoProps
> = ({ venues }) => {
  const { t } = useTranslation();

  if (venues.length === 0) {
    return null;
  }

  const isMultiple = venues.length > 1;

  return (
    <InfoWithIcon
      icon={<IconLocation aria-hidden="true" />}
      title={t('event.sidebar.locationTitle')}
    >
      <div className={styles.infoContent}>
        {isMultiple ? (
          <p className={styles.textRow}>
            {t('event.sidebar.multipleVenues')}
          </p>
        ) : (
          venues.map((v, i) => {
            const mapUrl = v.address
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  v.address
                )}`
              : null;
            return (
              <div key={v.id || i} className={styles.venueBlock}>
                {v.name && <p className={styles.textRow}>{v.name}</p>}
                {v.address && <p className={styles.textRow}>{v.address}</p>}
                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapLink}
                  >
                    <span>{t('event.sidebar.openMap')}</span>
                    <IconLinkExternal
                      size={IconSize.ExtraSmall}
                      aria-hidden="true"
                      className={styles.linkIcon}
                    />
                  </a>
                )}
              </div>
            );
          })
        )}
      </div>
    </InfoWithIcon>
  );
};

/**
 * Props for {@link EventSidebarParticipantsInfo}.
 */
export type EventSidebarParticipantsInfoProps = {
  participantsPerInvite?: EventParticipantsPerInviteEnum | null;
};

/**
 * Section displaying the participant criteria per invite (e.g. child and guardian).
 */
export const EventSidebarParticipantsInfo: React.FC<
  EventSidebarParticipantsInfoProps
> = ({ participantsPerInvite }) => {
  const { t } = useTranslation();

  if (!participantsPerInvite) {
    return null;
  }

  return (
    <InfoWithIcon
      icon={getParticipantsIcon(participantsPerInvite)}
      title={t('event.sidebar.participantsTitle')}
    >
      <div className={styles.infoContent}>
        <p className={styles.textRow}>
          {t(`event.participantsPerInviteEnum.${participantsPerInvite}`)}
        </p>
      </div>
    </InfoWithIcon>
  );
};

/**
 * Props for {@link EventSidebarLanguagesInfo}.
 */
export type EventSidebarLanguagesInfoProps = {
  languageText?: string | null;
  languagesCount?: number;
};

/**
 * Section displaying the available languages across event occurrences.
 */
export const EventSidebarLanguagesInfo: React.FC<
  EventSidebarLanguagesInfoProps
> = ({ languageText, languagesCount = 1 }) => {
  const { t } = useTranslation();

  if (!languageText) {
    return null;
  }

  const title =
    languagesCount === 1
      ? t('event.sidebar.languageTitle')
      : t('event.sidebar.languagesTitle');

  return (
    <InfoWithIcon
      icon={<IconGlobe aria-hidden="true" />}
      title={title}
    >
      <div className={styles.infoContent}>
        <p className={styles.textRow}>{languageText}</p>
      </div>
    </InfoWithIcon>
  );
};

/**
 * Props for {@link EventInfoSidebar}.
 */
export type EventInfoSidebarProps = {
  event: EventSidebarEvent;
  occurrences?: EventSidebarOccurrence[];
};

/**
 * Sidebar component displaying high-level metadata of an event:
 * occurrences count, duration, venues, participants configuration, and languages.
 */
export const EventInfoSidebar: React.FC<EventInfoSidebarProps> = ({
  event,
  occurrences = [],
}) => {
  const uniqueVenues = useMemo(
    () => extractUniqueVenues(null, occurrences),
    [occurrences]
  );

  const { uniqueLanguages, languageText } = useEventLanguages(
    null,
    occurrences
  );

  const isExternal = Boolean(
    event.ticketSystem?.type &&
      externalTicketSystems.includes(event.ticketSystem.type)
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        {isExternal && event.ticketSystem ? (
          <EventSidebarTicketSystemInfo ticketSystem={event.ticketSystem} />
        ) : (
          <EventSidebarOccurrencesInfo
            occurrences={occurrences}
            occurrencesCount={occurrences.length}
            duration={event.duration}
          />
        )}
        <EventSidebarDurationInfo duration={event.duration} />
        <EventSidebarLocationInfo venues={uniqueVenues} />
        <EventSidebarParticipantsInfo
          participantsPerInvite={event.participantsPerInvite}
        />
        <EventSidebarLanguagesInfo
          languageText={languageText}
          languagesCount={uniqueLanguages.length}
        />
      </div>
    </aside>
  );
};

export default EventInfoSidebar;
