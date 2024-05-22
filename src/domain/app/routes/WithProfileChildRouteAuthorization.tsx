import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import { useProfileChildRouteAuthorization } from './useProfileChildRouteAuthorization';

const ProfileChildRouteAuthorizationComponent = ({
  Component,
  ...rest
}: any) => {
  const { loading } = useProfileChildRouteAuthorization();
  if (loading) {
    // eslint-disable-next-line no-console
    console.info(
      'Using a loading spinner to wait for route authorization checking to be finished.'
    );
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
