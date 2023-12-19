import { useQuery, QueryHookOptions } from '@apollo/client';

import {
  ChildEnrolmentCountQuery,
  ChildEnrolmentCountQueryVariables,
} from '../api/generatedTypes/graphql';
import { childEnrolmentCountQuery } from './queries/ChildEnrolmentCountQuery';

export default function useChildEnrolmentCount(
  options?: QueryHookOptions<
    ChildEnrolmentCountQuery,
    ChildEnrolmentCountQueryVariables
  >
) {
  const { data, ...delegatedQuery } = useQuery<
    ChildEnrolmentCountQuery,
    ChildEnrolmentCountQueryVariables
  >(childEnrolmentCountQuery, options);

  const pastEnrolmentCount = data?.child?.pastEnrolmentCount ?? ' ';
  const enrolmentLimit = data?.child?.project?.enrolmentLimit ?? ' ';
  const areAllEnrolmentsUsed = data && pastEnrolmentCount >= enrolmentLimit;

  return { data, ...delegatedQuery, convenience: { areAllEnrolmentsUsed } };
}
