import useMutation from '../../api/useMutation';
import {
  UpdateChildMutation,
  UpdateChildMutationVariables,
} from '../../api/generatedTypes/graphql';
import { editChildMutation } from '../mutation/ChildMutation';
import profileQuery from '../../profile/queries/ProfileQuery';

function useUpdateChild() {
  return useMutation<UpdateChildMutation, UpdateChildMutationVariables>(
    editChildMutation,
    {
      useDefaultErrorHandling: true,
      refetchQueries: [{ query: profileQuery }],
    }
  );
}

export default useUpdateChild;
