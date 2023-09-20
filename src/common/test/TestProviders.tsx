import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

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
          <BrowserRouter>{children}</BrowserRouter>
        </HelmetProvider>
      </MockedProvider>
    </Provider>
  );
};

export default TestProviders;
