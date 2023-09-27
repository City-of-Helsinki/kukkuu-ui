import { useProfileChildRouteAuthorization } from './useProfileChildRouteAuthorization';

const WithProfileChildRouteAuthorization = (WrappedComponent: React.FC) => {
  return ({ ...props }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useProfileChildRouteAuthorization();
    return <WrappedComponent {...props} />;
  };
};

export default WithProfileChildRouteAuthorization;
