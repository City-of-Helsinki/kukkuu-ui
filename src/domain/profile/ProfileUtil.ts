import capitalize from 'lodash/capitalize';

import { Child } from '../child/types/ChildTypes';
import { getEligibleCities } from '../registration/notEligible/NotEligibleUtils';
import { childByIdQuery_child as ChildByIdResponse } from '../api/generatedTypes/childByIdQuery';
import {
  profileQuery_myProfile_children as Children,
  profileQuery_myProfile_children_edges_node_project as Project,
} from '../api/generatedTypes/profileQuery';

/**
 * Normalize child data from API response to a format usable by child form.
 */
export const normalizeProfileChild = (
  profileChild: ChildByIdResponse
): Child => {
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

export const getProjectsFromProfileQuery = (children: Children): Project[] => {
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
