import React from 'react';

import EventSearchUrlProvider from './EventSearchUrlProvider';
import EventSearchFormProvider from './EventSearchFormProvider';
import EventSearchResultsUiProvider from './EventSearchResultsUiProvider';

export type EventSearchProvidersProps = {
  children: React.ReactNode;
};

/**
 * Composite provider stacking:
 * 1. EventSearchUrlProvider (committed URL state)
 * 2. EventSearchFormProvider (draft form state, options, live badges)
 * 3. EventSearchResultsUiProvider (query results, sticky header, UX indicators)
 */
export const EventSearchProviders: React.FC<EventSearchProvidersProps> = ({
  children,
}) => {
  return (
    <EventSearchUrlProvider>
      <EventSearchFormProvider>
        <EventSearchResultsUiProvider>
          {children}
        </EventSearchResultsUiProvider>
      </EventSearchFormProvider>
    </EventSearchUrlProvider>
  );
};

export default EventSearchProviders;
