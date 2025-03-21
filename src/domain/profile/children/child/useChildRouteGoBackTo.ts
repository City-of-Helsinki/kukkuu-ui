import { useParams } from 'react-router-dom';

import useProfileRouteGoBackTo from './useProfileRouteGoBackTo';

export const useChildRouteGoBackTo = () => {
  const { childId } = useParams<{ childId: string }>();
  const profileUrl = useProfileRouteGoBackTo();
  return `${profileUrl}/child/${childId}`;
};

export default useChildRouteGoBackTo;
