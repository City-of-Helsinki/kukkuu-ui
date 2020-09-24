import { useApolloClient } from '@apollo/client';

import { profileChildrenQuery as ProfileChildrenQueryType } from '../../api/generatedTypes/profileChildrenQuery';
import profileChildrenQuery from '../../profile/queries/ProfileChildrenQuery';

function getIsChildOfProfile(
  childId: string,
  data?: ProfileChildrenQueryType
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

    const { data } = await client.query<ProfileChildrenQueryType>({
      query: profileChildrenQuery,
    });

    return Boolean(getIsChildOfProfile(childId, data));
  };

  return [queryIsChildOfProfile];
}

export default useIsChildOfProfile;
