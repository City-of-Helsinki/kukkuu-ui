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
  return useQuery<ChildEnrolmentCountQuery, ChildEnrolmentCountVariablesQuery>(
    childEnrolmentCountQuery,
    options
  );
}
