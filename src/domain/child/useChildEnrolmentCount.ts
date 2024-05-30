import { useQuery, QueryHookOptions } from '@apollo/client';

import {
  ChildEnrolmentCountDocument,
  ChildEnrolmentCountQuery,
  ChildEnrolmentCountQueryVariables,
} from '../api/generatedTypes/graphql';

export default function useChildEnrolmentCount(
  options?: QueryHookOptions<
    ChildEnrolmentCountQuery,
    ChildEnrolmentCountQueryVariables
  >
) {
  const { data, ...delegatedQuery } = useQuery<
    ChildEnrolmentCountQuery,
    ChildEnrolmentCountQueryVariables
  >(ChildEnrolmentCountDocument, options);

  const pastEnrolmentCount = data?.child?.pastEnrolmentCount ?? ' ';
  const enrolmentCount = data?.child?.enrolmentCount ?? ' ';
  const enrolmentLimit = data?.child?.project?.enrolmentLimit ?? ' ';
  const areAllEnrolmentsUsed = data && pastEnrolmentCount >= enrolmentLimit;
  const areAllCurrentEnrolmentsUsed = data && enrolmentCount >= enrolmentLimit;

  return {
    data,
    ...delegatedQuery,
    convenience: { areAllEnrolmentsUsed, areAllCurrentEnrolmentsUsed },
  };
}
