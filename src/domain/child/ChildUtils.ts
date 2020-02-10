import { TFunction } from 'i18next';
import omit from 'lodash/omit';

import { RelationshipTypeEnum } from '../api/generatedTypes/globalTypes';
import { Child } from './types/ChildTypes';
import { newMoment } from '../../common/time/utils';
import { defaultChildFormBirthdate } from './ChildConstants';
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

/**
 * The child data submitted from the form is supposed to
 * have the same types as the child data received from backend
 * TODO: Fix reducer default data to match backend typing
 */
export const getSupportedChildData = (child: Child) => {
  return omit(child, 'homeCity');
};

/**
 * Convert from birthdate in Date string format
 * to object of day month year, mostly to furfill form data structure
 */
export const getChildFormModalBirthdate = (birthdate?: string) => {
  if (!birthdate) {
    return defaultChildFormBirthdate;
  }

  const birthdateMoment = newMoment(birthdate);

  if (!birthdateMoment.isValid()) {
    return defaultChildFormBirthdate;
  }

  return {
    day: birthdateMoment.date(),
    month: birthdateMoment.month() + 1,
    year: birthdateMoment.year(),
  };
};

export const getChildFormModalValues = (child: Child) => {
  return Object.assign({}, child, {
    birthdate: getChildFormModalBirthdate(child.birthdate),
  });
};
