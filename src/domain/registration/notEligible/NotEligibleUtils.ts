import { newMoment } from '../../../common/time/utils';
import { SUPPORTED_START_BIRTHDATE } from '../../../common/time/TimeConstants';
import { Child } from '../../child/types/ChildTypes';

/** isBirthdateEligible()
 * Check if child is eligible for participation.
 *
 * Only children born in 2020 or later are eligible for this service.
 * @param {string} birthdate in YYYY-MM-DD format.
 * @returns {boolean}
 */
const isBirthdateEligible = (value: string) => {
  const inputMoment = newMoment(value, 'YYYY-MM-DD');
  const supportedStart = newMoment(SUPPORTED_START_BIRTHDATE);

  if (!inputMoment.isValid()) return false;

  if (inputMoment.isBefore(supportedStart)) {
    return false;
  }
  return true;
};

/** getEligibleCities()
 * Get an array of supported cities from .env
 * @returns {Array} Supported cities
 */
const getEligibleCities = () => {
  const eligibleCities = process.env.REACT_APP_ELIGIBLE_CITIES || 'helsinki';
  return eligibleCities.toLowerCase().split(',');
};

const isCityEligible = (city: string) => {
  const eligibleCities = getEligibleCities();
  return eligibleCities.includes(city.trim().toLowerCase());
};

/**isChildEligible
 * Check is child is eligible for the Godchildren of Culture program
 * @param {child} child child info submitted from form
 * @param {boolean} isEditing True if you are editing a child, then we don't check the city field content
 * @returns {boolean} if the child is eligible
 */
const isChildEligible = (
  child: Pick<Child, 'birthdate' | 'homeCity'>,
  isEditing = false
) => {
  const validators = [
    { validator: isBirthdateEligible, item: child.birthdate },
  ];

  if (!isEditing)
    validators.push({ validator: isCityEligible, item: child.homeCity });

  return validators.every((v) => v.validator(v.item));
};

export { getEligibleCities, isChildEligible };
