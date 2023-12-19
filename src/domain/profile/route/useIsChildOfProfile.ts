import { useApolloClient } from '@apollo/client';

import { ProfileChildrenQuery } from '../../api/generatedTypes/graphql';
import profileChildrenQuery from '../../profile/queries/ProfileChildrenQuery';

function getIsChildOfProfile(
  childId: string,
  data?: ProfileChildrenQuery
): boolean | null {
  if (!data) {
    return null;
  }

  const childrenIds = data.myProfile?.children.edges
    .map((edge) => edge?.node?.id)
    .filter((id): id is string => typeof id === 'string');

  return Boolean(childrenIds?.includes(childId));
}

type Result = [(childId?: string) => Promise<boolean>];

function useIsChildOfProfile(): Result {
  const client = useApolloClient();

  const queryIsChildOfProfile = async (childId?: string): Promise<boolean> => {
    if (!childId) {
      return false;
    }

    const { data } = await client.query<ProfileChildrenQuery>({
      query: profileChildrenQuery,
    });

    return Boolean(getIsChildOfProfile(childId, data));
  };

  return [queryIsChildOfProfile];
}

export default useIsChildOfProfile;
