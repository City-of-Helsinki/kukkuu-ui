import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook providing a function to format the capacity text for an occurrence.
 *
 * @param capacityPerOccurrence - Optional maximum capacity per occurrence.
 * @returns Formatting function taking remaining capacity and returning a localized string.
 */
export function useOccurrenceCapacityText(
  capacityPerOccurrence?: number | null
): (remaining: number | null | undefined) => string {
  const { t } = useTranslation();

  return useCallback(
    (remaining: number | null | undefined): string => {
      const isTotalKnown =
        typeof capacityPerOccurrence === 'number' && capacityPerOccurrence > 0;

      if (isTotalKnown) {
        return `${remaining ?? 0}/${capacityPerOccurrence}`;
      }

      if (remaining === null || remaining === undefined) {
        return t('event.occurrencesTable.unlimited');
      }

      return t('event.occurrencesTable.remainingCount', { count: remaining });
    },
    [capacityPerOccurrence, t]
  );
}

export default useOccurrenceCapacityText;

