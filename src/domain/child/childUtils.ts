import { RelationshipTypeEnum } from '../api/generatedTypes/globalTypes';
import { CHILD_RELATIONSHIP_OPTIONS } from './constants/ChildRelationshipConstants';

interface ChildRelationshipOptions {
  label: string;
  value: RelationshipTypeEnum;
}

/**
 * Translate label of relationship options.
 * @param {Function} Translation function from i18next-react
 * @return {ChildRelationshipOptions}[] array of label-value pairs with translated labels
 */
export const getTranslatedRelationshipOptions = (
  t: Function
): ChildRelationshipOptions[] => {
  return CHILD_RELATIONSHIP_OPTIONS.map(instance => {
    return {
      label: t(`CHILD_RELATIONSHIP_OPTIONS.${instance.label}`),
      value: instance.value,
    };
  });
};
