import { useApolloClient } from '@apollo/client';
import React from 'react';

import {
  ProfileChildrenQuery,
  ProfileChildrenQueryDocument,
} from '../../api/generatedTypes/graphql';

function getIsChildOfProfile(childId: string, data?: ProfileChildrenQuery) {
  if (!data) {
    return null;
  }

  const childrenIds = data.myProfile?.children.edges
    .map((edge) => edge?.node?.id)
    .filter((id): id is string => typeof id === 'string');

  return Boolean(childrenIds?.includes(childId));
}

function useIsChildOfProfile() {
  const client = useApolloClient();

  const queryIsChildOfProfile = React.useCallback(
    async (childId?: string) => {
      if (!childId) {
        return false;
      }
      const { data } = await client.query<ProfileChildrenQuery>({
        query: ProfileChildrenQueryDocument,
      });
      return Boolean(getIsChildOfProfile(childId, data));
    },
    [client]
  );
  return queryIsChildOfProfile;
}

export default useIsChildOfProfile;
