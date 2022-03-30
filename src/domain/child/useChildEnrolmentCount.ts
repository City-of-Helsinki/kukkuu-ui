import { useQuery, QueryHookOptions } from '@apollo/client';

import {
  ChildEnrolmentCount as ChildEnrolmentCountQuery,
  ChildEnrolmentCountVariables as ChildEnrolmentCountVariablesQuery,
} from '../api/generatedTypes/childEnrolmentCount';
import { childEnrolmentCountQuery } from './queries/ChildEnrolmentCountQuery';

export default function useChildEnrolmentCount(
  options?: QueryHookOptions<
    ChildEnrolmentCountQuery,
    ChildEnrolmentCountVariablesQuery
  >
) {
  const { data, ...delegatedQuery } = useQuery<
    ChildEnrolmentCountQuery,
    ChildEnrolmentCountVariablesQuery
  >(childEnrolmentCountQuery, options);

  const pastEnrolmentCount = data?.child?.pastEnrolmentCount ?? ' ';
  const enrolmentLimit = data?.child?.project?.enrolmentLimit ?? ' ';
  const areAllEnrollmentsUsed = data && pastEnrolmentCount >= enrolmentLimit;

  return { data, ...delegatedQuery, convenience: { areAllEnrollmentsUsed } };
}
