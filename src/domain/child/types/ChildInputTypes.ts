import {
  ChildInput,
  AddChildMutationInput,
  UpdateChildMutationInput,
} from '../../api/generatedTypes/graphql';

export interface Child extends ChildInput {
  homeCity: string;
}

export interface AddChild extends AddChildMutationInput {
  homeCity: string;
}

export interface UpdateChild extends UpdateChildMutationInput {
  homeCity: string;
}

export type Children = Child[];
