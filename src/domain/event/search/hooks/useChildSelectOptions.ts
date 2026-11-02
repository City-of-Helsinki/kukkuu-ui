import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import type { ProfileType } from '../../../profile/ProfileContext';

export type ChildSelectOption = {
  label: string;
  value: string;
};

export type UseChildSelectOptionsParams = {
  profile?: ProfileType;
  childId?: string;
  onChildSelect?: (childId: string) => void;
};

/**
 * Hook to manage child selection options, the currently selected option, and the selection handler.
 * Formats each child's name for the HDS Select dropdown.
 *
 * @param params.profile - Guardian's profile containing children edges.
 * @param params.childId - The ID of the currently selected or active child.
 * @param params.onChildSelect - Optional custom selection callback (e.g. for controlled draft form state).
 * @returns Object with `childrenOptions`, `selectedOptions`, and `handleChildChange`.
 */
export function useChildSelectOptions({
  profile,
  childId,
  onChildSelect,
}: UseChildSelectOptionsParams) {
  const navigate = useNavigate();

  const childrenOptions = useMemo<ChildSelectOption[]>(() => {
    return (profile?.children?.edges || [])
      .map((edge) => edge?.node)
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((c) => ({
        label: c.name,
        value: c.id,
      }));
  }, [profile?.children?.edges]);

  const selectedOptions = useMemo(() => {
    const match = childrenOptions.find((opt) => opt.value === childId);
    return match ? [match] : [];
  }, [childrenOptions, childId]);

  const [searchParams] = useSearchParams();

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
      if (!val || val === childId) {
        return;
      }

      if (onChildSelect) {
        onChildSelect(val);
        return;
      }

      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('child', val);
      nextParams.delete('page');
      navigate({ search: `?${nextParams.toString()}` });
    },
    [childId, navigate, onChildSelect, searchParams]
  );

  return {
    childrenOptions,
    selectedOptions,
    handleChildChange,
  };
}

export default useChildSelectOptions;

