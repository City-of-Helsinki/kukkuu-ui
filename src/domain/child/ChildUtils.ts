import { TFunction } from 'i18next';

import { RelationshipTypeEnum } from '../api/generatedTypes/globalTypes';

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
  t: TFunction
): ChildRelationshipOptions[] => {
  return [
    {
      label: t(`CHILD_RELATIONSHIP_OPTIONS.${RelationshipTypeEnum.ADVOCATE}`),
      value: RelationshipTypeEnum.ADVOCATE,
    },
    {
      label: t(
        `CHILD_RELATIONSHIP_OPTIONS.${RelationshipTypeEnum.OTHER_GUARDIAN}`
      ),
      value: RelationshipTypeEnum.OTHER_GUARDIAN,
    },
    {
      label: t(
        `CHILD_RELATIONSHIP_OPTIONS.${RelationshipTypeEnum.OTHER_RELATION}`
      ),
      value: RelationshipTypeEnum.OTHER_RELATION,
    },
    {
      label: t(`CHILD_RELATIONSHIP_OPTIONS.${RelationshipTypeEnum.PARENT}`),
      value: RelationshipTypeEnum.PARENT,
    },
  ];
};
