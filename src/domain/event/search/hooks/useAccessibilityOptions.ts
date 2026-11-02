import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { FilterOption, FilterOptionsHookResult } from '../types/filterTypes';

/**
 * Dedicated hook returning available options for the "Saavutettavuus" (Accessibility) filter.
 * 1st-iteration defaults: 5 accessibility accommodations.
 */
export function useAccessibilityOptions(): FilterOptionsHookResult {
  const { t } = useTranslation();

  // TODO: Fetch accessibility options dynamically from GraphQL API
  // once the backend accessibility endpoint is integrated.
  const options = useMemo<FilterOption[]>(
    () => [
      {
        value: 'mobility',
        label: t(
          'search.filter.accessibility.mobility',
          'Liikkumisen rajoitteet huomioitu'
        ),
      },
      {
        value: 'sensory',
        label: t(
          'search.filter.accessibility.sensory',
          'Aistiyliherkkyydet huomioitu'
        ),
      },
      {
        value: 'neurodiversity',
        label: t(
          'search.filter.accessibility.neurodiversity',
          'Neurokirjon tarpeet huomioitu'
        ),
      },
      {
        value: 'vision',
        label: t(
          'search.filter.accessibility.vision',
          'Näkemiseen liittyvät tarpeet huomioitu'
        ),
      },
      {
        value: 'hearing',
        label: t(
          'search.filter.accessibility.hearing',
          'Kuulemiseen liittyvät tarpeet huomioitu'
        ),
      },
    ],
    [t]
  );

  return { options, loading: false };
}

export default useAccessibilityOptions;
