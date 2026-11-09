import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconSize, IconSpeechless, IconUniversalAccess } from 'hds-react';
import classNames from 'classnames';

import { IconTooltip } from './IconTooltip';
import styles from './occurrenceSpecialIcons.module.scss';

export type OccurrenceSpecialIconsProps = {
  accessibilities?: string[] | null;
  speechless?: boolean;
  className?: string;
  iconSize?: IconSize;
  interactive?: boolean;
};

/**
 * Renders special occurrence indicators:
 * - Accessibility icon with tooltip listing accessibilities (or non-interactive icon)
 * - Speechless (non-verbal) icon with tooltip (or non-interactive icon)
 */
export const OccurrenceSpecialIcons: React.FC<OccurrenceSpecialIconsProps> = ({
  accessibilities,
  speechless = false,
  className,
  iconSize = IconSize.Small,
  interactive = true,
}) => {
  const { t } = useTranslation();
  const hasAccessibilities = Boolean(
    accessibilities && accessibilities.length > 0
  );

  if (!hasAccessibilities && !speechless) {
    return null;
  }

  if (!interactive) {
    return (
      <span className={classNames(styles.specialIconsWrapper, className)}>
        {hasAccessibilities && (
          <span
            className={styles.indicatorIcon}
            aria-hidden="true"
          >
            <IconUniversalAccess size={iconSize} />
          </span>
        )}
        {speechless && (
          <span
            className={styles.indicatorIcon}
            aria-hidden="true"
          >
            <IconSpeechless size={iconSize} />
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={classNames(styles.specialIconsWrapper, className)}>
      {hasAccessibilities && accessibilities && (
        <IconTooltip
          label={t('event.occurrencesTable.accessibilityAriaLabel')}
          icon={<IconUniversalAccess size={iconSize} />}
        >
          <ul className={styles.accessibilityList}>
            {accessibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </IconTooltip>
      )}

      {speechless && (
        <IconTooltip
          label={t('event.occurrencesTable.speechlessAriaLabel')}
          icon={<IconSpeechless size={iconSize} />}
        >
          <span>{t('event.occurrencesTable.speechlessLabel')}</span>
        </IconTooltip>
      )}
    </span>
  );
};

export default OccurrenceSpecialIcons;
