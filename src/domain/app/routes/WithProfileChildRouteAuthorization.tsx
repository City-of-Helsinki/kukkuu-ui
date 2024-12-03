import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import { useProfileChildRouteAuthorization } from './useProfileChildRouteAuthorization';

const WithProfileChildRouteAuthorization = (WrappedComponent: React.FC) => {
  const { loading } = useProfileChildRouteAuthorization();
  const result = ({ ...props }) => {
    if (loading) {
      // eslint-disable-next-line no-console
      console.info(
        'Using a loading spinner to wait for route authorization checking to be finished.'
      );
      return <LoadingSpinner isLoading={true} />;
    }
    return <WrappedComponent {...props} />;
  };
  result.displayName = `WithProfileChildRouteAuthorization(${
    WrappedComponent.displayName || WrappedComponent.name || 'Unnamed component'
  })`;
  return result;
};

export default WithProfileChildRouteAuthorization;
