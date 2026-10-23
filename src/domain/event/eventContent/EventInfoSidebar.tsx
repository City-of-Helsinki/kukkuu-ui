import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconCalendarClock,
  IconClock,
  IconGlobe,
  IconLinkExternal,
  IconLocation,
  IconSize,
} from 'hds-react';

import InfoWithIcon from '../../../common/components/infoWithIcon/InfoWithIcon';
import { EventParticipantsPerInvite as EventParticipantsPerInviteEnum } from '../../api/generatedTypes/graphql';
import {
  extractUniqueVenues,
  formatDuration,
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
};

/**
 * Props for {@link EventSidebarOccurrencesInfo}.
 */
export type EventSidebarOccurrencesInfoProps = {
  occurrencesCount: number;
  onViewOccurrences?: () => void;
};

/**
 * Section displaying the number of occurrences and an action button
 * to scroll down to the occurrences table.
 */
export const EventSidebarOccurrencesInfo: React.FC<
  EventSidebarOccurrencesInfoProps
> = ({ occurrencesCount, onViewOccurrences }) => {
  const { t } = useTranslation();

  const handleScrollToOccurrences = () => {
    if (onViewOccurrences) {
      onViewOccurrences();
      return;
    }
    document
      .getElementById('occurrences-table')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <InfoWithIcon
      icon={<IconCalendarClock aria-hidden="true" />}
      title={t('event.sidebar.dateTitle')}
    >
      <div className={styles.infoContent}>
        <p className={styles.textRow}>
          {t('event.sidebar.occurrencesCount', {
            count: occurrencesCount,
          })}
        </p>
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

  return (
    <InfoWithIcon
      icon={<IconLocation aria-hidden="true" />}
      title={t('event.sidebar.locationTitle')}
    >
      <div className={styles.infoContent}>
        {venues.map((v, i) => {
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
        })}
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
};

/**
 * Section displaying the available languages across event occurrences.
 */
export const EventSidebarLanguagesInfo: React.FC<
  EventSidebarLanguagesInfoProps
> = ({ languageText }) => {
  const { t } = useTranslation();

  if (!languageText) {
    return null;
  }

  return (
    <InfoWithIcon
      icon={<IconGlobe aria-hidden="true" />}
      title={t('event.sidebar.languagesTitle')}
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

  const { languageText } = useEventLanguages(null, occurrences);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <EventSidebarOccurrencesInfo occurrencesCount={occurrences.length} />
        <EventSidebarDurationInfo duration={event.duration} />
        <EventSidebarLocationInfo venues={uniqueVenues} />
        <EventSidebarParticipantsInfo
          participantsPerInvite={event.participantsPerInvite}
        />
        <EventSidebarLanguagesInfo languageText={languageText} />
      </div>
    </aside>
  );
};

export default EventInfoSidebar;
