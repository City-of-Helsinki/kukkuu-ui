import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook providing a function to format the capacity text for an occurrence.
 * In the redesigned table, displays the plain remaining seat count (e.g. "66"),
 * or localized unlimited capacity message if capacity is unlimited / null.
 *
 * @returns Formatting function taking remaining capacity and returning a localized string.
 */
export function useOccurrenceCapacityText(): (
  remaining: number | null | undefined
) => string {
  const { t } = useTranslation();

  return useCallback(
    (remaining: number | null | undefined): string => {
      if (typeof remaining === 'number') {
        return String(remaining);
      }

      if (remaining === null || remaining === undefined) {
        return t('event.occurrencesTable.unlimited');
      }

      return t('event.occurrencesTable.remainingCount', { count: remaining });
    },
    [t]
  );
}

export default useOccurrenceCapacityText;
