import { ChildrenQuery_children_edges_node as GeneratedChildType } from '../../api/generatedTypes/ChildrenQuery';
import { ChildInput } from '../../api/generatedTypes/globalTypes';

export interface Child extends ChildInput {
  postalCode: string;
  // TODO: Remove me when backend actually support homeCity to single child
  homeCity: string;
}

export type ChildResponse = Partial<GeneratedChildType>;

export type Children = Child[];
