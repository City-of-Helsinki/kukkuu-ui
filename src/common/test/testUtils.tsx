import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import React, { ReactElement } from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';

import { store } from '../../domain/app/state/AppStore';

type ProvidersProps = {
  children: ReactElement;
  mocks?: MockedResponse[];
  store: Store<unknown, AnyAction>;
};

const Providers = ({ children, mocks, store }: ProvidersProps) => {
  return (
    <Provider store={store}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router history={createBrowserHistory()}>{children}</Router>
      </MockedProvider>
    </Provider>
  );
};

export const mountWithProvider = (
  children: ReactElement,
  mocks?: MockedResponse[]
) =>
  mount(children, {
    wrappingComponent: Providers,
    wrappingComponentProps: {
      mocks,
      store,
    },
  });

export const shallowWithProvider = (
  children: ReactElement,
  mocks?: MockedResponse[]
) =>
  shallow(
    // For some reason using wrappingComponent does not work here
    <Providers store={store} mocks={mocks}>
      {children}
    </Providers>
  );
