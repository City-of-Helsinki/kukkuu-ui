import { SUPPORTED_START_BIRTH_YEAR } from '../../../common/time/TimeConstants';
import { Child } from '../../child/types/ChildInputTypes';

/** isBirthyearEligible()
 * Check if child's birthyear is eligible for participation.
 *
 * Only children born in 2020 or later are eligible for this service.
 * @param {number} birthyear in yyyy format.
 * @returns {boolean}
 */
const isBirthyearEligible = (value: number): boolean => {
  return value >= SUPPORTED_START_BIRTH_YEAR;
};

/** getEligibleCities()
 * Get an array of supported cities from .env
 * @returns {Array} Supported cities
 */
const getEligibleCities = (): Array<string> => {
  const eligibleCities =
    import.meta.env.VITE_ELIGIBLE_CITIES || 'helsinki,helsingfors';
  return eligibleCities.toLowerCase().split(',');
};

const isCityEligible = (city: string) => {
  const eligibleCities = getEligibleCities();
  return eligibleCities.includes(city.trim().toLowerCase());
};

/**isChildEligible
 * Check if child is eligible for the Culture kids programme
 * @param {child} child child info submitted from form
 * @param {boolean} isEditing True if you are editing a child, then we don't check the city field content
 * @returns {boolean} if the child is eligible
 */
const isChildEligible = (
  child: Pick<Child, 'birthyear' | 'homeCity'>,
  isEditing = false
): boolean =>
  isBirthyearEligible(child.birthyear) &&
  (isEditing || isCityEligible(child.homeCity));

export { getEligibleCities, isChildEligible };
