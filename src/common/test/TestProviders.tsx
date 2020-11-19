import React, { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';

import { store } from '../../domain/app/state/AppStore';

type Props = {
  children: ReactElement | ReactNode;
  mocks?: MockedResponse[];
};

const TestProviders = ({ children, mocks }: Props) => {
  return (
    <Provider store={store}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <HelmetProvider>
          <Router history={createBrowserHistory()}>{children}</Router>
        </HelmetProvider>
      </MockedProvider>
    </Provider>
  );
};

export default TestProviders;
