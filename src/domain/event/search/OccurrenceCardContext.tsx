import React, { createContext, useContext, useMemo } from 'react';

export type OccurrenceCardDateBadgePosition =
  | 'top-right'
  | 'before-title'
  | 'over-image'
  | 'none';

export interface OccurrenceCardConfig {
  dateBadgePosition?: OccurrenceCardDateBadgePosition;
}

const defaultOccurrenceCardConfig: OccurrenceCardConfig = {
  dateBadgePosition: 'top-right',
};

const OccurrenceCardContext = createContext<OccurrenceCardConfig>(
  defaultOccurrenceCardConfig
);

export interface OccurrenceCardProviderProps {
  value?: OccurrenceCardConfig;
  children: React.ReactNode;
}

export const OccurrenceCardProvider: React.FC<OccurrenceCardProviderProps> = ({
  value,
  children,
}) => {
  const mergedConfig = useMemo(
    () => ({
      ...defaultOccurrenceCardConfig,
      ...value,
    }),
    [value]
  );

  return (
    <OccurrenceCardContext.Provider value={mergedConfig}>
      {children}
    </OccurrenceCardContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOccurrenceCardConfig = (): OccurrenceCardConfig => {
  return useContext(OccurrenceCardContext);
};

export default OccurrenceCardContext;
