import capitalize from 'lodash/capitalize';

import { Child } from '../child/types/ChildInputTypes';
import { getEligibleCities } from '../registration/notEligible/NotEligibleUtils';
import { ChildByIdResponse } from '../child/types/ChildByIdQueryTypes';
import { Project, MyProfileChildren } from './types/ProfileQueryTypes';

/**
 * Normalize child data from API response to a format usable by child form.
 */
export const normalizeProfileChild = (
  profileChild: ChildByIdResponse
): Omit<Child, 'languagesSpokenAtHome'> => {
  const { relationships, ...childWithoutRelationships } = profileChild;
  const defaultHomeCity = capitalize(getEligibleCities()[0]);

  return {
    ...childWithoutRelationships,
    ...{
      relationship: {
        type: relationships.edges[0]?.node?.type,
      },
      homeCity: defaultHomeCity,
    },
  };
};

export const getProjectsFromProfileQuery = (
  children: MyProfileChildren
): Project[] => {
  const empty: Project = {
    id: '',
    name: '',
    year: 0,
  };

  return children?.edges
    ?.map((child) => child?.node?.project || empty)
    .filter(
      (project, i, arr) => arr.findIndex((t) => t.id === project.id) === i
    )
    .sort((a, b) => ((a.year || 0) > (b.year || 0) ? 1 : -1));
};
