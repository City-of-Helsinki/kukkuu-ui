import React from 'react';

import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import { useProfileChildRouteAuthorization } from './useProfileChildRouteAuthorization';

type Props = {
  Component: React.FC;
};

const ProfileChildRouteAuthorizationComponent = ({
  Component,
  ...rest
}: Props) => {
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
  const result = ({ ...props }) => {
    return (
      <ProfileChildRouteAuthorizationComponent
        Component={WrappedComponent}
        {...props}
      />
    );
  };
  result.displayName = `WithProfileChildRouteAuthorization(${
    WrappedComponent.displayName || WrappedComponent.name || 'Unnamed component'
  })`;
  return result;
};

export default WithProfileChildRouteAuthorization;
