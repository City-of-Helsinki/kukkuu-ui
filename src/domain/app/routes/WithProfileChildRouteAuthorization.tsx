import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import { useProfileChildRouteAuthorization } from './useProfileChildRouteAuthorization';

const ProfileChildRouteAuthorizationComponent = ({
  Component,
  ...rest
}: any) => {
  const { loading } = useProfileChildRouteAuthorization();
  if (loading) {
    return <LoadingSpinner isLoading={true} />;
  }
  return <Component {...rest} />;
};

const WithProfileChildRouteAuthorization = (WrappedComponent: React.FC) => {
  return ({ ...props }) => {
    return (
      <ProfileChildRouteAuthorizationComponent
        Component={WrappedComponent}
        {...props}
      />
    );
  };
};

export default WithProfileChildRouteAuthorization;
