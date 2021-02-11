import { createContext } from 'react';

const AriaLiveContext = createContext<{
  message: string;
  sendMessage: (message: string) => void;
}>({
  message: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  sendMessage: () => {},
});

export default AriaLiveContext;
