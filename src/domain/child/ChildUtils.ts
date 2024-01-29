import { TFunction } from 'i18next';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

import { RelationshipTypeEnum } from '../api/generatedTypes/graphql';
import { Child, UpdateChild, AddChild } from './types/ChildInputTypes';

const RESTRICTED_COMMON_CHILD_FIELDS = [
  'project',
  'homeCity',
  'occurrences',
  'availableEvents',
  'enrolments',
  'pastEvents',
  '__typename',
];

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
      label: t(`CHILD_RELATIONSHIP_OPTIONS.${RelationshipTypeEnum.Parent}`),
      value: RelationshipTypeEnum.Parent,
    },
    {
      label: t(
        `CHILD_RELATIONSHIP_OPTIONS.${RelationshipTypeEnum.OtherGuardian}`
      ),
      value: RelationshipTypeEnum.OtherGuardian,
    },
  ];
};

/**
 * The child data submitted from the form is supposed to
 * have the same types as the child data received from backend
 * TODO: Fix reducer default data to match backend typing
 */
export const getSupportedChildData = (
  child: Child | AddChild | UpdateChild,
  isEdit?: boolean
) => {
  const fields = [...RESTRICTED_COMMON_CHILD_FIELDS];
  if (isEdit) {
    fields.push('birthyear');
  }
  return omit(child, fields);
};

export const getChildFormModalValues = (child: Child) => {
  return pick(child, [
    'name',
    'birthyear',
    'homeCity',
    'postalCode',
    'relationship',
  ]);
};
