import {
  profileQuery_guardians_edges_node as GeneratedProfile,
  profileQuery_guardians_edges_node_children_edges_node as GeneratedProfileChild,
} from '../../api/generatedTypes/profileQuery';

export interface ProfileType extends Omit<GeneratedProfile, 'children'> {
  children: GeneratedProfileChild[] | null;
}
