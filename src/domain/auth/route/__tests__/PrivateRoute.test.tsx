import React, { FunctionComponent } from 'react';
import { shallow } from 'enzyme';
import { Redirect } from 'react-router';

import {
  UnconnectedPrivateRoute as PrivateRoute,
  PrivateRouteProps,
} from '../PrivateRoute';

const ExampleComponent: FunctionComponent = () => <>foo</>;

const wrapperCreator = (props: PrivateRouteProps) =>
  shallow(
    <PrivateRoute {...props}>
      <ExampleComponent />
    </PrivateRoute>
  );

it('renders Route with protected component if authenticated', () => {
  const route = wrapperCreator({
    isAuthenticated: true,
  });
  expect(route.props().render({ location: 'foo' })).toEqual(
    <ExampleComponent />
  );
});

it('Redirect user to home if not authed', () => {
  const route = wrapperCreator({
    isAuthenticated: false,
  });

  const expectation = (
    <Redirect
      to={{
        pathname: '/home',
        state: { from: 'foo' },
      }}
    />
  );

  expect(route.props().render({ location: 'foo' })).toEqual(expectation);
});
