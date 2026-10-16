import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  IconCalendarClock,
  IconCalendarPlus,
  IconGlobe,
  IconLinkExternal,
  IconLocation,
  IconSize,
} from 'hds-react';

import InfoWithIcon from '../../../common/components/infoWithIcon/InfoWithIcon';
import {
  formatOccurrenceDateLong,
  formatOccurrenceTimeRange,
} from '../../../common/time/occurrenceTime';
import styles from './eventInfoSidebar.module.scss';

export interface EventSidebarVenue {
  id?: string;
  name?: string | null;
  address?: string | null;
}

export interface EventSidebarOccurrence {
  id: string;
  time: string;
  occurrenceLanguage?: string | null;
  venue?: EventSidebarVenue | null;
}

export interface EventSidebarEvent {
  id: string;
  duration?: number | null;
}

export interface EventInfoSidebarProps {
  event: EventSidebarEvent;
  selectedOccurrence?: EventSidebarOccurrence | null;
  otherOccurrences?: EventSidebarOccurrence[];
  childId: string;
}

export const EventInfoSidebar: React.FC<EventInfoSidebarProps> = ({
  event,
  selectedOccurrence,
  otherOccurrences = [],
  childId,
}) => {
  const { t, i18n } = useTranslation();

  const formattedDate = selectedOccurrence
    ? formatOccurrenceDateLong(selectedOccurrence.time, i18n.language)
    : null;
  const formattedTime = selectedOccurrence
    ? formatOccurrenceTimeRange(selectedOccurrence.time, event.duration)
    : null;

  const venueName = selectedOccurrence?.venue?.name;
  const venueAddress = selectedOccurrence?.venue?.address;
  const mapUrl = venueAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`
    : null;

  const languageName = selectedOccurrence?.occurrenceLanguage
    ? t(
        `common.language.${selectedOccurrence.occurrenceLanguage.toLowerCase()}`,
        selectedOccurrence.occurrenceLanguage
      )
    : null;

  const filteredOtherOccurrences = otherOccurrences.filter(
    (occ) => occ.id !== selectedOccurrence?.id
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        {/* 1. Päivä ja aika */}
        {selectedOccurrence && (
          <InfoWithIcon
            icon={<IconCalendarClock aria-hidden="true" />}
            title={t('event.sidebar.dateTitle')}
          >
            <div className={styles.infoContent}>
              <p className={styles.textRow}>{formattedDate}</p>
              <p className={styles.textRow}>{formattedTime}</p>
            </div>
          </InfoWithIcon>
        )}

        {/* 2. Paikka */}
        {(venueName || venueAddress) && (
          <InfoWithIcon
            icon={<IconLocation aria-hidden="true" />}
            title={t('event.sidebar.locationTitle')}
          >
            <div className={styles.infoContent}>
              {venueName && <p className={styles.textRow}>{venueName}</p>}
              {venueAddress && <p className={styles.textRow}>{venueAddress}</p>}
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  <span>{t('event.sidebar.openMap')}</span>
                  <IconLinkExternal size={IconSize.ExtraSmall} aria-hidden="true" className={styles.linkIcon} />
                </a>
              )}
            </div>
          </InfoWithIcon>
        )}

        {/* 3. Kielet */}
        {languageName && (
          <InfoWithIcon
            icon={<IconGlobe aria-hidden="true" />}
            title={t('event.sidebar.languagesTitle')}
          >
            <div className={styles.infoContent}>
              <p className={styles.textRow}>{languageName}</p>
            </div>
          </InfoWithIcon>
        )}

        {/* 4. Tapahtuman muut ajat */}
        {filteredOtherOccurrences.length > 0 && (
          <InfoWithIcon
            icon={<IconCalendarPlus aria-hidden="true" />}
            title={t('event.sidebar.otherOccurrencesTitle')}
          >
            <ul className={styles.otherTimesList}>
              {filteredOtherOccurrences.map((occ) => {
                const occDate = formatOccurrenceDateLong(occ.time, i18n.language);
                const occTime = formatOccurrenceTimeRange(occ.time, event.duration);
                const occUrl = `/profile/child/${childId}/event/${event.id}?occurrenceId=${occ.id}`;

                return (
                  <li key={occ.id} className={styles.otherTimeItem}>
                    <Link to={occUrl} className={styles.otherTimeLink}>
                      {occDate}, {occTime}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </InfoWithIcon>
        )}
      </div>
    </aside>
  );
};

export default EventInfoSidebar;
