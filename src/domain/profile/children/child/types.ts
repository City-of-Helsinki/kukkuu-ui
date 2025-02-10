import type { UpdateChildMutationInput } from '../../../api/generatedTypes/graphql';

export type ChildDetailEditModalPayload = Omit<UpdateChildMutationInput, 'id'>;
