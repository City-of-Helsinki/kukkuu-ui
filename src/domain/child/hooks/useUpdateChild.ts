import useMutation from '../../api/useMutation';
import {
  updateChild as UpdateChildMutation,
  updateChildVariables,
} from '../../api/generatedTypes/updateChild';
import { editChildMutation } from '../mutation/ChildMutation';
import profileQuery from '../../profile/queries/ProfileQuery';

function useUpdateChild() {
  return useMutation<UpdateChildMutation, updateChildVariables>(
    editChildMutation,
    {
      useDefaultErrorHandling: true,
      refetchQueries: [{ query: profileQuery }],
    }
  );
}

export default useUpdateChild;
