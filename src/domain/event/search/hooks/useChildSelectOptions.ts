import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import type { ProfileType } from '../../../profile/ProfileContext';

export type ChildSelectOption = {
  label: string;
  value: string;
};

export type UseChildSelectOptionsParams = {
  profile?: ProfileType;
  childId?: string;
};

/**
 * Hook to manage child selection options, the currently selected option, and the navigation handler.
 * Formats each child's name and age for the HDS Select dropdown.
 *
 * @param params.profile - Guardian's profile containing children edges.
 * @param params.childId - The ID of the currently active child.
 * @returns Object with `childrenOptions`, `selectedOptions`, and `handleChildChange`.
 */
export function useChildSelectOptions({
  profile,
  childId,
}: UseChildSelectOptionsParams) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentYear] = useState(() => new Date().getFullYear());

  const childrenOptions = useMemo<ChildSelectOption[]>(() => {
    return (profile?.children?.edges || [])
      .map((edge) => edge?.node)
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((c) => {
        const age = currentYear - c.birthyear;
        return {
          label: `${c.name} (${t('search.hero.childAge', { age })})`,
          value: c.id,
        };
      });
  }, [profile?.children?.edges, currentYear, t]);

  const selectedOptions = useMemo(() => {
    const match = childrenOptions.find((opt) => opt.value === childId);
    return match ? [match] : [];
  }, [childrenOptions, childId]);

  const handleChildChange = useCallback(
    (
      selected:
        | ChildSelectOption
        | ChildSelectOption[]
        | string
        | null
        | undefined
    ) => {
      const first = Array.isArray(selected) ? selected[0] : selected;
      const val = typeof first === 'string' ? first : first?.value;
      if (val && val !== childId) {
        navigate(`/profile/child/${val}/events`);
      }
    },
    [childId, navigate]
  );

  return {
    childrenOptions,
    selectedOptions,
    handleChildChange,
  };
}

export default useChildSelectOptions;

