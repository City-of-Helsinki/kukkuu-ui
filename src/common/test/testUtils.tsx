import { mount, shallow } from 'enzyme';
import React, { ReactElement } from 'react';
import { MockedResponse } from '@apollo/client/testing';

import TestProviders from './TestProviders';

export const mountWithProvider = (
  children: ReactElement,
  mocks?: MockedResponse[]
) =>
  mount(children, {
    wrappingComponent: TestProviders,
    wrappingComponentProps: {
      mocks,
    },
  });

export const shallowWithProvider = (
  children: ReactElement,
  mocks?: MockedResponse[]
) =>
  shallow(
    // For some reason using wrappingComponent does not work here
    <TestProviders mocks={mocks}>{children}</TestProviders>
  );
