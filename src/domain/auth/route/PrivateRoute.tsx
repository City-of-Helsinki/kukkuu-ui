import React, { FunctionComponent } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { isAuthenticatedSelector } from '../state/authSelectors';
import { StoreState } from '../../app/types/stateTypes';
import { getCurrentLanguage } from '../../../common/translation/utils';

interface AuthProps {
  isAuthenticated: boolean;
}
export type PrivateRouteProps = RouteProps & AuthProps;

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({
  isAuthenticated,
  children,
  ...rest
}) => {
  const currentLanguage = getCurrentLanguage();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: `/${currentLanguage}/home`,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

const UnconnectedPrivateRoute = PrivateRoute;

const mapStateToProps = (state: StoreState) => ({
  isAuthenticated: isAuthenticatedSelector(state),
});

export { UnconnectedPrivateRoute };
export default connect(mapStateToProps)(PrivateRoute);
